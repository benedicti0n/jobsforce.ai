import { create } from 'zustand';

// Define the type for the modal store
interface ModalStore {
    isEditOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    isEditOpen: false,
    openModal: () => set({ isEditOpen: true }),
    closeModal: () => set({ isEditOpen: false }),
}));

// Define the type for the loading store
interface LoadingStore {
    isLoading: boolean;
    startLoading: () => void;
    finishLoading: () => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
    isLoading: false,
    startLoading: () => set({ isLoading: true }),
    finishLoading: () => set({ isLoading: false }),
}));