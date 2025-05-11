from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models import Sum, Count
# Restframework
from rest_framework import status
from rest_framework.decorators import api_view, APIView, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny ,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from drf_yasg.utils import swagger_auto_schema
from datetime import datetime
from drf_yasg import openapi
from django.db.models import Q

# Others
import json
import random
from random import randint

# Custom Imports
from api import serializer as api_serializer
from api import models as api_models


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer  

class RegisterView(generics.CreateAPIView):
    queryset = api_models.User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = api_serializer.RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']

        user = api_models.User.objects.get(id=user_id)
        profile = api_models.Profile.objects.get(user=user)
        return profile
    

class SendPasswordResetOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = api_models.User.objects.get(email=email)
            otp = randint(1000, 9999)  # Generate a 4-digit OTP
            user.otp = str(otp)
            user.save()

            # Send OTP to user's email
            subject = "Password Reset OTP"
            message = f"Your OTP for password reset is: {otp}"
            user.email_user(subject, message)

            return Response({"message": "OTP sent to email"}, status=status.HTTP_200_OK)
        except api_models.User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordWithOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not email or not otp or not new_password:
            return Response({"error": "Email, OTP, and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = api_models.User.objects.get(email=email, otp=otp)
            user.set_password(new_password)
            user.otp = ""  # Clear the OTP after successful reset
            user.save()

            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        except api_models.User.DoesNotExist:
            return Response({"error": "Invalid OTP or email"}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        print("Authorization Header:", request.headers.get("Authorization"))  # Debugging
        print("Authenticated User:", request.user)  # Debugging

        user_id = request.data.get("user_id")
        print("user_id : ",user_id)
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response({"error": "Both current and new passwords are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = api_models.User.objects.get(id=user_id)
        except api_models.User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        # Check if the current password is correct
        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        # Update the password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)#-------------------------------------- Post APIs ----------------------------------------------


class FollowUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        follower_id = request.data.get('follower_id')
        following_id = request.data.get('following_id')

        if not follower_id or not following_id:
            return Response({"error": "Both follower_id and following_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            follower = api_models.User.objects.get(id=follower_id)
            following = api_models.User.objects.get(id=following_id)
        except api_models.User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if api_models.Follow.objects.filter(follower=follower, following=following).exists():
            # Instead of returning a 400 error, return a friendly message
            return Response({"message": "You are already following this user."}, status=status.HTTP_200_OK)

        api_models.Follow.objects.create(follower=follower, following=following)
        return Response({"message": "User followed successfully"}, status=status.HTTP_201_CREATED)
    
class UnfollowUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        follower_id = request.data.get('follower_id')  # Get follower ID from request
        following_id = request.data.get('following_id')  # Get following ID from request

        if not follower_id or not following_id:
            return Response({"error": "Both follower_id and following_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            follower = api_models.User.objects.get(id=follower_id)
            following = api_models.User.objects.get(id=following_id)
        except api_models.User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        follow_instance = api_models.Follow.objects.filter(follower=follower, following=following).first()
        if not follow_instance:
            return Response({"error": "You are not following this user"}, status=status.HTTP_400_BAD_REQUEST)

        follow_instance.delete()
        return Response({"message": "User unfollowed successfully"}, status=status.HTTP_200_OK)


class FollowingListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = api_models.User.objects.get(id=user_id)
        except api_models.User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        following = api_models.Follow.objects.filter(follower=user)
        serializer = api_serializer.FollowSerializer(following, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowersListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = api_models.User.objects.get(id=user_id)
        except api_models.User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        followers = api_models.Follow.objects.filter(following=user)
        serializer = api_serializer.FollowSerializer(followers, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)         

class CategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Category.objects.all()

class PostCategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug'] 
        category = api_models.Category.objects.get(slug=category_slug)
        return api_models.Post.objects.filter(category=category, status="Active")

class PostListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Post.objects.all()
    
class PostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.PostSerializer

    def get_object(self):
        try:
            slug = self.kwargs['slug']
            post = api_models.Post.objects.get(slug=slug, status="Active")
            # post.view += 1    
            post.save()
            return post
        except api_models.Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

class IncrementViewAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request,slug):
        try:
            post = api_models.Post.objects.get(slug=slug)
            post.view += 1
            post.save()
            return Response({"message": "View count incremented"}, status=status.HTTP_200_OK)
        except api_models.Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
class LikePostAPIView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        user_id = request.data['user_id']
        post_id = request.data['post_id']
        if not user_id or not post_id:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)


        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        # Check if post has already been liked by this user
        if user in post.likes.all():
            # If liked, unlike post
            post.likes.remove(user)
            return Response({"message": "Post Disliked"}, status=status.HTTP_200_OK)
        else:
            # If post hasn't been liked, like the post by adding user to set of poeple who have liked the post
            post.likes.add(user)
            
            # Create Notification for Author
            api_models.Notification.objects.create(
                user=post.user,
                post=post,
                type="Like",
            )
            return Response({"message": "Post Liked"}, status=status.HTTP_201_CREATED)
        
class PostCommentAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'comment': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        # Get data from request.data (frontend)
        post_id = request.data['post_id']
        name = request.data['name']
        email = request.data['email']
        comment = request.data['comment']

        post = api_models.Post.objects.get(id=post_id)

        # Create Comment
        api_models.Comment.objects.create(
            post=post,
            name=name,
            email=email,
            comment=comment,
        )

        # Notification
        api_models.Notification.objects.create(
            user=post.user,
            post=post,
            type="Comment",
        )

        # Return response back to the frontend
        return Response({"message": "Commented Sent"}, status=status.HTTP_201_CREATED)
 

class ReplyToCommentAPIView(APIView):
    def post(self, request):
        comment_id = request.data.get("comment_id")
        name = request.data.get("name")
        email = request.data.get("email")
        reply_text = request.data.get("reply")

        if not all([comment_id, name, email, reply_text]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parent_comment = api_models.Comment.objects.get(id=comment_id)
        except api_models.Comment.DoesNotExist:
            return Response({"error": "Parent comment not found."}, status=status.HTTP_404_NOT_FOUND)

        reply = api_models.Comment.objects.create(
            post=parent_comment.post,
            parent=parent_comment,
            name=name,
            email=email,
            comment=reply_text,
        )

        serialized_reply = api_serializer.ReplySerializer(reply)
        return Response(serialized_reply.data, status=status.HTTP_201_CREATED)


class SearchPostsAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        query = request.GET.get("query", "")
        if query:
            posts = api_models.Post.objects.filter(
                Q(title__icontains=query) |  # Match title
                Q(tags__icontains=query) |  # Match tags
                Q(category__title__icontains=query),  # Match category title
                status="Active"  # Ensure the post is active
            )
            serializer = api_serializer.PostSerializer(posts, many=True,context={"request": request})
            return Response(serializer.data)
        return Response({"message": "No query provided"}, status=400)
    
 
class BookmarkPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        user_id = request.data['user_id']
        post_id = request.data['post_id']
        
        if not user_id or not post_id:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        bookmark = api_models.Bookmark.objects.filter(post=post, user=user).first()
        if bookmark:
            # Remove post from bookmark
            bookmark.delete()
            return Response({"message": "Post Un-Bookmarked"}, status=status.HTTP_200_OK)
        else:
            api_models.Bookmark.objects.create(
                user=user,
                post=post
            )

            # Notification
            api_models.Notification.objects.create(
                user=post.user,
                post=post,
                type="Bookmark",
            )
            return Response({"message": "Post Bookmarked"}, status=status.HTTP_201_CREATED)

class UserBookmarksAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        bookmarks = api_models.Bookmark.objects.filter(user_id=user_id).select_related('post')
        serializer = api_serializer.BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data, status=200)
    
    
######################## Author Dashboard APIs ########################

class DashboardPostLists(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        return api_models.Post.objects.filter(user=user).order_by("-id")


class DashboardNotificationLists(generics.ListAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        return api_models.Notification.objects.filter(seen=False, user=user)

class DashboardMarkNotiSeenAPIView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'noti_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request):
        noti_id = request.data['noti_id']
        noti = api_models.Notification.objects.get(id=noti_id)

        noti.seen = True
        noti.save()

        return Response({"message": "Noti Marked As Seen"}, status=status.HTTP_200_OK)

    
class DashboardPostCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        title = request.data.get('title')
        image = request.data.get('image')
        description = request.data.get('description')
        tags = request.data.get('tags')
        category_id = request.data.get('category')
        post_status = request.data.get('post_status')

        user = api_models.User.objects.get(id=user_id)
        category = api_models.Category.objects.get(id=category_id)

        post = api_models.Post.objects.create(
            user=user,
            title=title,
            image=image,
            description=description,
            tags=tags,
            category=category,
            status=post_status
        )

        return Response({"message": "Post Created Successfully"}, status=status.HTTP_201_CREATED)

class DashboardPostEditAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['user_id']
        post_id = self.kwargs['post_id']
        user = api_models.User.objects.get(id=user_id)
        return api_models.Post.objects.get(user=user, id=post_id)

    def update(self, request, *args, **kwargs):
        post_instance = self.get_object()

        title = request.data.get('title')
        image = request.data.get('image')
        description = request.data.get('description')
        tags = request.data.get('tags')
        # category_id = request.data.get('category')
        post_status = request.data.get('post_status')
        
        # category = api_models.Category.objects.get(id=category_id)

        post_instance.title = title
        if image != "undefined":
            post_instance.image = image
        post_instance.description = description
        post_instance.tags = tags
        # post_instance.category = category
        post_instance.status = post_status
        post_instance.save()

        return Response({"message": "Post Updated Successfully"}, status=status.HTTP_200_OK)

class DashboardPostDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, post_id, user_id):
        post = get_object_or_404(api_models.Post, id=post_id)
        if int(post.user.id) != int(user_id):
            return Response({"error": "Unauthorized !"}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT) 
            

class ContactAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        subject = request.data.get("subject")
        message = request.data.get("message")

        if not all([name, email, subject, message]):
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Send email to the user
            user_message = f"Hi {name},\n\nThank you for reaching out! Here is a copy of your message:\n\n{message}\n\nWe will get back to you soon.\n\nBest regards,\nAakash Jha"
            user = api_models.User(email=email)  # Create a temporary user object to use email_user()
            user.email_user(f"Your message to Aakash Jha: {subject}", user_message)

            # Send email to Aakash Jha
            admin_message = f"You have received a new message:\n\nName: {name}\nEmail: {email}\nMessage: {message}"
            admin = api_models.User(email="aakashjha343@gmail.com")  # Create a temporary user object for admin
            admin.email_user(f"New Contact Form Submission: {subject}", admin_message)

            return Response({"message": "Emails sent successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)