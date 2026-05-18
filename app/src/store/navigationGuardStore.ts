import { create } from "zustand";

interface NavigationGuardStore {
  isDirty: boolean;
  pendingPath: string | null;

  setDirty: (dirty: boolean) => void;
  setPendingPath: (path: string | null) => void;
}

export const useNavigationGuardStore = create<NavigationGuardStore>((set) => ({
  isDirty: false,
  pendingPath: null,

  setDirty: (dirty) => set({ isDirty: dirty }),
  setPendingPath: (path) => set({ pendingPath: path }),
}));
