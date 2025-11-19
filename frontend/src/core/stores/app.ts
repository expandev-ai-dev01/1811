import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;

  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'app-store' }
  )
);
