// utils/authUtils.ts

import { auth } from "firebase-admin"; // Firebase Admin SDK
import { cookies } from "next/headers"; // Import Next.js cookies utility

// Helper function to fetch user info
export async function fetchUserInfo(firebaseId: string): Promise<any> {
  const apiUrl = `${process.env.API_BASE_URL}/api/user/${firebaseId}`; // Use environment variable for base URL

  const response = await fetch(apiUrl, { cache: "no-store" }); // Avoid caching for dynamic data
  if (!response.ok) {
    throw new Error(`Error fetching user info: ${response.statusText}`);
  }

  return await response.json();
}

// Helper function to refresh the ID token using the refresh token
export async function refreshIdToken(refreshToken: string): Promise<string> {
  try {
    // Use Firebase Admin SDK to verify the refresh token and get a new ID token
    const userCredentials = await auth().verifySessionCookie(refreshToken);

    // Create a new custom ID token
    const newIdToken = await auth().createCustomToken(userCredentials.uid);
    return newIdToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh token");
  }
}

// Main function to handle token verification, refreshing, and fetching user info
export async function verifyTokenAndFetchUserInfo() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token || !refreshToken) {
    return {
      error: "Unauthorized",
      message: "Please log in to access this page.",
    };
  }

  try {
    // Verify the token with Firebase Admin SDK
    const decodedToken = await auth().verifyIdToken(token);
    const { uid } = decodedToken;

    // Fetch the user info using the decoded UID
    const userInfo = await fetchUserInfo(uid);

    return {
      userInfo,
      error: null,
    };
  } catch (error: any) {
    // Handle token expiry or verification error
    console.log(error, "TanvirError");

    try {
      // Attempt to refresh the token using the refresh token
      const newToken = await refreshIdToken(refreshToken);

      // Now, use the new token to fetch the user info
      const decodedToken = await auth().verifyIdToken(newToken);
      const { uid } = decodedToken;

      const userInfo = await fetchUserInfo(uid);

      return {
        userInfo,
        error: null,
      };
    } catch (refreshError) {
      console.error("Failed to refresh token:", refreshError);
      return {
        error: "Authentication Failed",
        message:
          "There was an issue refreshing your session. Please log in again.",
      };
    }
  }
}