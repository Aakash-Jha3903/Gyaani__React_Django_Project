from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views as api_views

urlpatterns = [
    # Userauths API Endpoints
    path('user/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', api_views.RegisterView.as_view(), name='auth_register'),
    path('user/profile/<user_id>/', api_views.ProfileView.as_view(), name='user_profile'),
   
    path('user/send-password-reset-otp/', api_views.SendPasswordResetOTPAPIView.as_view()),
    path('user/reset-password-with-otp/', api_views.ResetPasswordWithOTPAPIView.as_view()),
    path('user/change-password/', api_views.ChangePasswordAPIView.as_view()),

    # Post Endpoints
    path('post/category/list/', api_views.CategoryListAPIView.as_view()),
    path('post/category/posts/<category_slug>/', api_views.PostCategoryListAPIView.as_view()),
    path('post/lists/', api_views.PostListAPIView.as_view()),
    
    path('post/detail/<slug>/', api_views.PostDetailAPIView.as_view()),
    path('post/increment-view/<slug>/', api_views.IncrementViewAPIView.as_view()),
    path('post/like-post/', api_views.LikePostAPIView.as_view()),
    path('post/bookmark-post/', api_views.BookmarkPostAPIView.as_view()),
    path('user/bookmarks/<int:user_id>/', api_views.UserBookmarksAPIView.as_view(), name='user-bookmarks'),
    
    path('post/comment-post/', api_views.PostCommentAPIView.as_view()),
    path("search-posts/", api_views.SearchPostsAPIView.as_view(), name="search-posts"),
    
    
    # Follow Endpoints
    path('user/follow/', api_views.FollowUserAPIView.as_view(), name='follow_user'),
    path('user/unfollow/', api_views.UnfollowUserAPIView.as_view(), name='unfollow_user'),
    path('user/following/<user_id>/', api_views.FollowingListAPIView.as_view(), name='following_list'),
    path('user/followers/<user_id>/', api_views.FollowersListAPIView.as_view(), name='followers_list'),

    # Dashboard APIS
    path('author/dashboard/post-list/<user_id>/', api_views.DashboardPostLists.as_view()),
    path('author/dashboard/noti-list/<user_id>/', api_views.DashboardNotificationLists.as_view()),
    path('author/dashboard/noti-mark-seen/', api_views.DashboardMarkNotiSeenAPIView.as_view()),
    path('post/reply-comment/', api_views.ReplyToCommentAPIView.as_view()),
    path('author/dashboard/post-create/', api_views.DashboardPostCreateAPIView.as_view()),
    path('author/dashboard/post-detail/<user_id>/<post_id>/', api_views.DashboardPostEditAPIView.as_view()),
    path('author/dashboard/post-delete/<post_id>/<user_id>', api_views.DashboardPostDeleteAPIView.as_view()),
    path("sendGmail/contact/", api_views.ContactAPIView.as_view()),
]
