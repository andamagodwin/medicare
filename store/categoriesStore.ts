import { create } from 'zustand';
import { getCategories } from '../lib/appwrite';

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
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories', loading: false });
    }
  },
}));
