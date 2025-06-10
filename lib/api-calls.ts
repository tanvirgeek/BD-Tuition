import { useUserStore } from "@/store/store";

export const fetchUser = async (firebaseUserId: string) => {
  try {
    const response = await fetch(`/api/user/${firebaseUserId}`);
    if (!response.ok) throw new Error("Failed to fetch user");

    const user = await response.json();
    useUserStore.getState().setUser(user);
    useUserStore.getState().setUserInfo(user.userInfo)
     // Store user in Zustand
  } catch (error) {
    if (error instanceof Error)
    console.log("Error fetching user:", error.message);
  }
};