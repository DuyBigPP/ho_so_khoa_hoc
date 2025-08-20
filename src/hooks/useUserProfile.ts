import { useContext } from 'react'
import { UserProfileContext, type UserProfileContextType } from '@/contexts/userProfileContext.ts'

export function useUserProfile(): UserProfileContextType {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}
