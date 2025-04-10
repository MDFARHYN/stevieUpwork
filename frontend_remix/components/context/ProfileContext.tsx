// app/context/ProfileContext.tsx
import { createContext, useContext, ReactNode } from "react";

interface ProfileData {
  comments: string[]; // Adjust based on your API response
  [key: string]: any;
}

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({
  children,
  profile,
  loading,
  error,
}: {
  children: ReactNode;
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}) {
  return (
    <ProfileContext.Provider value={{ profile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}