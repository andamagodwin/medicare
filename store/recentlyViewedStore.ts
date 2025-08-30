import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RecentDoctor {
  $id: string;
  name: string;
  speciality?: string;
  rating?: number;
  experience?: string;
  hospital?: string;
  consultationFee?: number;
  viewedAt: string; // ISO string timestamp
}

interface RecentlyViewedState {
  recentDoctors: RecentDoctor[];
  addRecentDoctor: (doctor: Omit<RecentDoctor, 'viewedAt'>) => void;
  clearRecentDoctors: () => void;
  getRecentDoctors: (limit?: number) => RecentDoctor[];
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      recentDoctors: [],
      
      addRecentDoctor: (doctor) => {
        const { recentDoctors } = get();
        const now = new Date().toISOString();
        
        // Remove if already exists (to avoid duplicates and update timestamp)
        const filteredDoctors = recentDoctors.filter(d => d.$id !== doctor.$id);
        
        // Add to beginning of array with current timestamp
        const updatedDoctors = [
          { ...doctor, viewedAt: now },
          ...filteredDoctors
        ].slice(0, 20); // Keep only last 20 viewed doctors
        
        set({ recentDoctors: updatedDoctors });
      },
      
      clearRecentDoctors: () => {
        set({ recentDoctors: [] });
      },
      
      getRecentDoctors: (limit = 10) => {
        const { recentDoctors } = get();
        return recentDoctors
          .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'recently-viewed-doctors',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
