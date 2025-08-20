import React, { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { UserProfileApiService, type UserProfile } from '@/service/user_profile'

interface AvatarUploadProps {
  currentProfile: UserProfile | null
  onAvatarUpdated: (updatedProfile: UserProfile) => void
  size?: 'sm' | 'md' | 'lg'
  showUploadButton?: boolean
}

export function AvatarUpload({ 
  currentProfile, 
  onAvatarUpdated, 
  size = 'lg',
  showUploadButton = true 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Avatar size classes
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  }

  // Get user initials for fallback
  const getUserInitials = (fullName: string | undefined | null) => {
    if (!fullName || typeof fullName !== 'string') return 'UN'
    
    return fullName
      .trim()
      .split(' ')
      .filter(name => name.length > 0)
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'UN'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError('')

    try {
      console.log('AvatarUpload: Starting upload...')
      const updatedProfile = await UserProfileApiService.uploadAvatar(file)
      console.log('AvatarUpload: Upload successful:', updatedProfile)
      
      // Clear preview since we now have the real avatar
      setPreviewUrl(null)
      
      // Notify parent component
      onAvatarUpdated(updatedProfile)
    } catch (err) {
      console.error('AvatarUpload: Upload error:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi upload ảnh')
      setPreviewUrl(null) // Clear preview on error
    } finally {
      setIsUploading(false)
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    if (isUploading) return
    fileInputRef.current?.click()
  }

  // Use preview URL if available, otherwise use avatar_url from profile
  const avatarSrc = previewUrl || currentProfile?.avatar_url || undefined

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar Display */}
      <div className="relative group">
        <Avatar className={`${sizeClasses[size]} cursor-pointer transition-opacity ${isUploading ? 'opacity-50' : 'group-hover:opacity-80'}`} onClick={handleClick}>
          <AvatarImage 
            src={avatarSrc} 
            alt={currentProfile?.full_name || 'Avatar'} 
          />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getUserInitials(currentProfile?.full_name)}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        {!isUploading && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleClick}
          >
            <Camera className="h-4 w-4 text-white" />
          </div>
        )}
        
        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-4 w-4 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload Button */}
      {showUploadButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Thay đổi ảnh
            </>
          )}
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="max-w-sm">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
