

import { Client, Account, Databases, ID, Query } from 'appwrite';



export const appwriteConfig = {
  endpoint: 'https://fra.cloud.appwrite.io/v1', // Your Appwrite endpoint
  platform: 'com.medicare.app', // Your app's bundle ID
  projectId: '68a966840004622123eb', // Your Appwrite project ID - SET THIS UP
  databaseId: '68a973b6002a615f1877', // Your database ID - SET THIS UP
  userCollectionId: '68a973e70006456a7347', // Your users collection ID - SET THIS UP
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

// Auth functions
export async function createAccount(email: string, password: string, name: string) {
  try {
    // First check if there's already an active session
    const currentUser = await getCurrentUser();
    if (currentUser) {
      // If there's already a session, sign out first
      await signOut();
    }
    
    const newAccount = await account.create(ID.unique(), email, password, name);
    
    if (!newAccount) throw new Error('Account creation failed');
    
    return newAccount;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    // First check if there's already an active session
    const currentUser = await getCurrentUser();
    if (currentUser) {
      // If there's already a session, sign out first
      await signOut();
    }
    
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    console.error('Error signing in:', error);
    // If session already exists, try to get current user
    if (error.message?.includes('session is active')) {
      const user = await getCurrentUser();
      if (user) {
        throw new Error('You are already logged in. Please logout first.');
      }
    }
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const currentUser = await account.get();
    return currentUser;
  } catch (error: any) {
    // If user is not authenticated (guests role), return null instead of logging error
    if (error.code === 401 || error.message?.includes('guests') || error.message?.includes('missing scope')) {
      return null;
    }
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function signOut() {
  try {
    // Try to delete current session
    const session = await account.deleteSession('current');
    return session;
  } catch (error: any) {
    // If no session exists, that's fine
    if (error.code === 401 || error.message?.includes('session')) {
      return null;
    }
    console.error('Error signing out:', error);
    throw error;
  }
}

// Function to clear all sessions (useful for debugging)
export async function clearAllSessions() {
  try {
    await account.deleteSessions();
    return true;
  } catch (error: any) {
    if (error.code === 401) {
      return true; // No sessions to clear
    }
    console.error('Error clearing sessions:', error);
    throw error;
  }
}

export async function getCategories() {
  try {
    // Replace with your categories collection ID
    const categoriesCollectionId = '68a9e197001bd64f65aa'
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      categoriesCollectionId
    );
    // Map Appwrite documents to Category type
    return response.documents.map((doc: any) => ({
      id: doc.$id,
      name: doc.name,
      icon_name: doc.icon_name,
      color: doc.color,
      specialist_count: doc.specialist_count || 0,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Create user profile in database
export async function createUserProfile(
  userId: string, 
  userData: {
    name: string;
    email: string;
    userType: 'patient' | 'doctor';
    phone?: string;
    specialization?: string; // For doctors
    licenseNumber?: string; // For doctors
    dateOfBirth?: string; // For patients
    address?: string;
  }
) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        userId,
        ...userData,
      }
    );
    
    return newUser;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userProfile = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('userId', userId)
      ]
    );
    
    return userProfile.documents[0] || null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}
