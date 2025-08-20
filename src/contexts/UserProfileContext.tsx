import React, { useEffect, useState, useCallback } from 'react'
import { UserProfileApiService, type UserProfile } from '../service/user_profile/apiService.ts'
import { useAuth } from './AuthContext'
import { loadFromCache, saveToCache, clearCache as clearCacheUtil } from './userProfileUtils.ts'
import { UserProfileContext, type UserProfileContextType } from './userProfileContext.ts'

interface UserProfileProviderProps {
  children: React.ReactNode
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  // Fetch profile from API
  const fetchProfile = useCallback(async (force = false): Promise<UserProfile | null> => {
    if (!isAuthenticated || user?.role !== 'user') {
      return null
    }

    // Check cache first (unless forced)
    if (!force) {
      const cachedProfile = loadFromCache()
      if (cachedProfile) {
        setProfile(cachedProfile)
        return cachedProfile
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('UserProfileContext: Fetching from API...')
      const profileData = await UserProfileApiService.getUserProfile()
      
      setProfile(profileData)
      saveToCache(profileData)
      
      return profileData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin hồ sơ'
      setError(errorMessage)
      console.error('UserProfileContext: Error fetching profile:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.role])

  // Initialize profile on mount or when user changes
  useEffect(() => {
    if (isAuthenticated && user?.role === 'user') {
      fetchProfile()
    } else {
      // Clear profile for non-user roles or when not authenticated
      setProfile(null)
      setError(null)
    }
  }, [isAuthenticated, user?.role, fetchProfile])

  // Public methods
  const refreshProfile = useCallback(async () => {
    await fetchProfile(true) // Force refresh
  }, [fetchProfile])

  const updateProfile = useCallback((updatedProfile: UserProfile) => {
    console.log('UserProfileContext: Updating profile in context')
    setProfile(updatedProfile)
    saveToCache(updatedProfile)
  }, [])

  const clearCache = useCallback(() => {
    clearCacheUtil()
    setProfile(null)
    setError(null)
  }, [])

  const value: UserProfileContextType = {
    profile,
    isLoading,
    error,
    refreshProfile,
    updateProfile,
    clearCache
  }

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  )
}


