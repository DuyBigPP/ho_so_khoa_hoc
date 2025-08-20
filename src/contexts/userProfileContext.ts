import { createContext } from 'react'
import { UserProfile } from '../service/user_profile/apiService.ts'

export interface UserProfileContextType {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
  updateProfile: (updatedProfile: UserProfile) => void
  clearCache: () => void
}

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)
