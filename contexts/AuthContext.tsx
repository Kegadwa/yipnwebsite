import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  userService, 
  User, 
  UserRole, 
  ROLE_PERMISSIONS,
  UserPermissions 
} from '../lib/firebase-services';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  userRole: UserRole | null;
  userPermissions: UserPermissions | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = userService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await userService.getUserProfile(firebaseUser.uid);
          if (userProfile && userProfile.isActive) {
            setCurrentUser(userProfile);
          } else {
            // User profile doesn't exist or is inactive, create default profile
            if (firebaseUser.email) {
              const defaultUser: Omit<User, 'id' | 'createdAt'> = {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                role: UserRole.VIEWER, // Default role
                permissions: ROLE_PERMISSIONS[UserRole.VIEWER],
                isActive: true,
                lastLogin: new Date() as any,
              };
              
              const userId = await userService.createUserProfile(defaultUser);
              const newUser = { ...defaultUser, id: userId } as User;
              setCurrentUser(newUser);
            }
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await userService.signIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await userService.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return userService.hasPermission(currentUser, permission);
  };

  const userRole = currentUser?.role || null;
  const userPermissions = currentUser?.permissions || null;

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signOut,
    hasPermission,
    userRole,
    userPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
