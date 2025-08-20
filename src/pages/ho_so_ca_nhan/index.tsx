import { useEffect, useState } from 'react'
import { ProfileCompletionModal } from '@/components/profile/ProfileCompletionModal'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { UserProfileCard } from '@/components/profile/UserProfileCard'
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton'
import { ProfileService } from '@/service/profileService'
import { type UserProfile } from '@/service/user_profile'
import { useAuth } from '@/contexts/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const HoSoCaNhan = () => {
  const { user, updateUser } = useAuth()
  const { profile: userProfile, isLoading: isLoadingProfile, error: profileError, updateProfile } = useUserProfile()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isCheckingProfile, setIsCheckingProfile] = useState(true)
  
  // Edit profile modal state
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    // Only check for user role
    if (user?.role !== 'user') {
      setIsCheckingProfile(false)
      return
    }

    const checkProfileCompletion = async () => {
      try {
        console.log('HoSoCaNhan: Checking profile completion...')
        const profileStatus = await ProfileService.getProfileCompletionStatus()
        console.log('HoSoCaNhan: Profile status:', profileStatus)
        console.log('HoSoCaNhan: is_first_time:', profileStatus.is_first_time)
        
        if (profileStatus.is_first_time) {
          console.log('HoSoCaNhan: ✅ Showing profile completion modal')
          setShowProfileModal(true)
        }
      } catch (error) {
        console.error('HoSoCaNhan: Error checking profile:', error)
        // If error, don't show modal to avoid blocking user
      } finally {
        setIsCheckingProfile(false)
      }
    }

    checkProfileCompletion()
  }, [user])

  const handleProfileCompleted = () => {
    console.log('HoSoCaNhan: Profile completed, hiding modal')
    setShowProfileModal(false)
    // Profile will be automatically refreshed by the context
  }

  const handleEditProfile = () => {
    console.log('HoSoCaNhan: Opening edit profile modal')
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    console.log('HoSoCaNhan: Closing edit profile modal')
    setShowEditModal(false)
  }

  const handleProfileUpdated = (updatedProfile: UserProfile) => {
    console.log('HoSoCaNhan: Profile updated:', updatedProfile)
    
    // Update profile in context (which also updates cache)
    // The API service now guarantees valid data, so no need for validation
    updateProfile(updatedProfile)
    
    // Also update AuthContext to refresh sidebar
    if (user && user.role === 'user') {
      updateUser({
        name: updatedProfile.full_name || user.name,
        avatar: updatedProfile.avatar_url || updatedProfile.avatar_path || user.avatar
      })
    }
  }

  // Profile data is now managed by UserProfileContext
  // No need for manual loading - context handles it automatically

  if (isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Đang kiểm tra hồ sơ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Content */}
      {profileError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      ) : isLoadingProfile ? (
        <ProfileSkeleton />
      ) : userProfile ? (
        <UserProfileCard 
          profile={userProfile} 
          onEditClick={handleEditProfile}
          onProfileUpdated={handleProfileUpdated}
        />
      ) : null}

      {/* Profile Completion Modal */}
      <ProfileCompletionModal 
        isOpen={showProfileModal}
        onCompleted={handleProfileCompleted}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        currentProfile={userProfile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  )
}

export default HoSoCaNhan