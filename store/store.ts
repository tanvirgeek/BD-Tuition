import { create } from "zustand";
import { User, UserInfo } from '@prisma/client'
import { persist } from "zustand/middleware";
import { UserData } from "@/app/dashboard/page";
import { SearchModalBodyData } from "@/app/components/SearchModal";

interface AuthState {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (authStatus: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: null, // initial state
  setIsAuthenticated: (authStatus: boolean) =>
    set({ isAuthenticated: authStatus }),
}));

type UserState = {
  user: User | null
  userInfo: UserInfo | null
  setUser: (user: User) => void
  setUserInfo: (userInfo: UserInfo) => void
  clearUser: () => void
  clearUserInfo: () => void
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userInfo: null,
  setUser: (user: User) => set({ user }),
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
  clearUser: () => set({ user: null }),
  clearUserInfo: () => set({ userInfo: null }),
}))


type RegisterNavigationState = {
  isFromRegister: boolean | null;
  setIsFromRegister: (navStatus: boolean) => void;
}

export const useRegisterNavigation = create<RegisterNavigationState>((set) => ({
  isFromRegister: null,
  setIsFromRegister: (navStatus: boolean) =>
    set({ isFromRegister: navStatus })
}))


type AnotherUserState = {
  anotherUser: User | null;
  anotherUserInfo: UserInfo | null;
  setAnotherUser: (anotherUser: User) => void;
  setAnotherUserInfo: (anotherUserInfo: UserInfo) => void;
  clearUser: () => void;
  clearUserInfo: () => void;
};

export const useAnotherUserStore = create(
  persist<AnotherUserState>(
    (set) => ({
      anotherUser: null,
      anotherUserInfo: null,
      setAnotherUser: (anotherUser: User) => set({ anotherUser }),
      setAnotherUserInfo: (anotherUserInfo: UserInfo) => set({ anotherUserInfo }),
      clearUser: () => set({ anotherUser: null }),
      clearUserInfo: () => set({ anotherUserInfo: null }),
    }),
    {
      name: "another-user-store", // Key for localStorage
      partialize: (state) => ({
        anotherUser: state.anotherUser,
        anotherUserInfo: state.anotherUserInfo,
        // Include these methods as no-ops or undefined since the full type must match
        setAnotherUser: state.setAnotherUser,
        setAnotherUserInfo: state.setAnotherUserInfo,
        clearUser: state.clearUser,
        clearUserInfo: state.clearUserInfo,
      }),
    }
  )
);

type SearchedUsersState = {
  searchedusers: UserData[];
  setSearchedUsers: (searchedusers: UserData[]) => void;
  clearedSearchedUsers: () => void
}

export const useSearchedUserStore = create<SearchedUsersState>((set) => ({
  searchedusers: [],
  setSearchedUsers: (searchedusers: UserData[]) => set({ searchedusers }),
  clearedSearchedUsers: () => set({ searchedusers: [] }),
}))


type SearchedModalBodyDataState = {
  searchedFormData: SearchModalBodyData;
  setSearchedFormData: (searchedFormData: SearchModalBodyData) => void;
  clearedSearchedFormData: () => void
}

export const useSearchedModalBodyDataState = create<SearchedModalBodyDataState>((set) => ({
  searchedFormData: {
    name: "",
    district: "",
    institutionName: "",
    gender: "",
    interestedSubjects: [],
    upazila: "",
    role: "",
    page: 1,
    limit: 8,

  },
  setSearchedFormData: (searchedFormData: SearchModalBodyData) => set({ searchedFormData }),
  clearedSearchedFormData: () => set({
    searchedFormData: {
      name: "",
      district: "",
      institutionName: "",
      gender: "",
      interestedSubjects: [],
      upazila: "",
      role: "",
      page: 1,
      limit: 8,

    },
  }),
}))


type InfiniteScrollBodyDataState = {
  infiniteScrollFormData: SearchModalBodyData;
  setInfiniteScrollFormData: (infiniteScrollFormData: SearchModalBodyData) => void;
  clearedInfiniteScrollFormData: () => void
}

export const useInfiniteScrolllBodyDataState = create<InfiniteScrollBodyDataState>((set) => ({
  infiniteScrollFormData: {
    name: "",
    district: "",
    institutionName: "",
    gender: "",
    interestedSubjects: [],
    upazila: "",
    role: "",
    page: 1,
    limit: 8,

  },
  setInfiniteScrollFormData: (infiniteScrollFormData: SearchModalBodyData) => set({ infiniteScrollFormData }),
  clearedInfiniteScrollFormData: () => set({
    infiniteScrollFormData: {
      name: "",
      district: "",
      institutionName: "",
      gender: "",
      interestedSubjects: [],
      upazila: "",
      role: "",
      page: 1,
      limit: 8,

    },
  }),
}))



interface SearchModalState {
  isSearchModalOpen: boolean;
  setIsSearchmodalOpen: (isSearchModalOpen: boolean) => void;
};

export const useSearchModal = create<SearchModalState>((set) => ({
  isSearchModalOpen: false, // initial state
  setIsSearchmodalOpen: (isSearchModalOpen: boolean) =>
    set({ isSearchModalOpen: isSearchModalOpen }),
}));

interface IsLoadingForUserCards {
  isLoadingForUserCards: boolean;
  setIsLoadingForUserCards: (isLoadingForUserCards: boolean) => void;
};

export const useIsLoadingForUserCards = create<IsLoadingForUserCards>((set) => ({
  isLoadingForUserCards: false, // initial state
  setIsLoadingForUserCards: (isLoadingForUserCards: boolean) =>
    set({ isLoadingForUserCards: isLoadingForUserCards }),
}));


interface SearchingState {
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
};

export const useSearchingState = create<SearchingState>((set) => ({
  isSearching: false, // initial state
  setIsSearching: (isSearching: boolean) =>
    set({ isSearching: isSearching}),
}));


