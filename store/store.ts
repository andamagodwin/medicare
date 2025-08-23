import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createAccount, 
  signIn, 
  signOut, 
  getCurrentUser, 
  createUserProfile, 
  getUserProfile,
  clearAllSessions
} from '../lib/appwrite';

export interface User {
  $id: string;
  email: string;
  name: string;
  userType?: 'patient' | 'doctor';
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthState: (showLoading?: boolean) => Promise<void>;
  setUser: (user: User | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  clearSessions: () => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: 'patient' | 'doctor';
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  dateOfBirth?: string;
  address?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isLoggedIn: false,
      hasHydrated: false,

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated });
      },

      setUser: (user: User | null) => {
        set({ 
          user, 
          isLoggedIn: !!user 
        });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          await signIn(email, password);
          const currentUser = await getCurrentUser();
          
          if (currentUser) {
            // Get user profile with additional data
            const userProfile = await getUserProfile(currentUser.$id);
            
            const userData: User = {
              $id: currentUser.$id,
              email: currentUser.email,
              name: currentUser.name,
              ...userProfile,
            };
            
            set({ 
              user: userData, 
              isLoggedIn: true, 
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        try {
          const { name, email, password, ...profileData } = userData;
          
          // Create account
          const newAccount = await createAccount(email, password, name);
          
          if (newAccount) {
            // Sign in the user
            await signIn(email, password);
            
            // Create user profile
            await createUserProfile(newAccount.$id, {
              name,
              email,
              ...profileData,
            });
            
            const user: User = {
              $id: newAccount.$id,
              email,
              name,
              ...profileData,
            };
            
            set({ 
              user, 
              isLoggedIn: true, 
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut();
          set({ 
            user: null, 
            isLoggedIn: false, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      clearSessions: async () => {
        set({ isLoading: true });
        try {
          await clearAllSessions();
          set({ 
            user: null, 
            isLoggedIn: false, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Clear sessions error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuthState: async (showLoading = true) => {
        if (showLoading) {
          set({ isLoading: true });
        }
        try {
          const currentUser = await getCurrentUser();
          
          if (currentUser) {
            const userProfile = await getUserProfile(currentUser.$id);
            
            const userData: User = {
              $id: currentUser.$id,
              email: currentUser.email,
              name: currentUser.name,
              ...userProfile,
            };
            
            set({ 
              user: userData, 
              isLoggedIn: true, 
              isLoading: false 
            });
          } else {
            set({ 
              user: null, 
              isLoggedIn: false, 
              isLoading: false 
            });
          }
        } catch (error: any) {
          // Only log actual errors, not authentication errors
          if (error.code !== 401 && !error.message?.includes('guests') && !error.message?.includes('missing scope')) {
            console.error('Auth check error:', error);
          }
          set({ 
            user: null, 
            isLoggedIn: false, 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// Legacy store for other app state
export interface BearState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
}

export const useStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
