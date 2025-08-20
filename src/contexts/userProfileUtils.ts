import { UserProfile } from '../service/user_profile/apiService.ts'

// Cache configuration
export const CACHE_KEY = 'user_profile_cache'
export const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export interface CachedProfile {
  data: UserProfile
  timestamp: number
}

// Cache utility functions
export const loadFromCache = (): UserProfile | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const parsedCache: CachedProfile = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid
    if (now - parsedCache.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    console.log('UserProfileContext: Loading from cache')
    return parsedCache.data
  } catch (error) {
    console.error('UserProfileContext: Error loading from cache:', error)
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

export const saveToCache = (profileData: UserProfile): void => {
  try {
    const cacheData: CachedProfile = {
      data: profileData,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    console.log('UserProfileContext: Saved to cache')
  } catch (error) {
    console.error('UserProfileContext: Error saving to cache:', error)
  }
}

export const clearCache = (): void => {
  console.log('UserProfileContext: Clearing cache')
  localStorage.removeItem(CACHE_KEY)
}
