import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useAuthStore = create((set, get) => ({
  allUserData: null,
  loading: false,

  setUser: (user) => set({ allUserData: user }),
  setLoading: (loading) => set({ loading }),

  user: () => {
    const data = get().allUserData;
    return {
      user_id: data?.user_id || null,
      username: data?.username || null,
    };
  },
  
  isLoggedIn: () => get().allUserData !== null,
  // isLoggedIn: get().allUserData !== null,
}));

if (import.meta.env.DEV) {
  mountStoreDevtool('Store', useAuthStore);
}

export { useAuthStore };

