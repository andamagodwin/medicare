import { create } from 'zustand';
import { getCategories, getAllSpecialtyCounts } from '../lib/appwrite';

export interface Category {
  id: string;
  name: string;
  icon_name: string;
  color: string;
  specialist_count: number;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  updateSpecialtyCounts: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getCategories();
      set({ categories, loading: false });
      // After fetching categories, update with real doctor counts
      get().updateSpecialtyCounts();
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories', loading: false });
    }
  },
  updateSpecialtyCounts: async () => {
    try {
      const specialtyCounts = await getAllSpecialtyCounts();
      const { categories } = get();
      
      const updatedCategories = categories.map(category => ({
        ...category,
        specialist_count: specialtyCounts[category.name] || 0
      }));
      
      set({ categories: updatedCategories });
    } catch (error) {
      console.error('Error updating specialty counts:', error);
    }
  },
}));
