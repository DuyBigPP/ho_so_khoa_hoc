import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, User } from 'lucide-react'
import { UserProfileApiService, type UserProfile, type UpdateUserProfileRequest } from '@/service/user_profile'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentProfile: UserProfile | null
  onProfileUpdated: (updatedProfile: UserProfile) => void
}

export function EditProfileModal({ 
  isOpen, 
  onClose, 
  currentProfile, 
  onProfileUpdated 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UpdateUserProfileRequest>({
    full_name: '',
    phone_number: '',
    birth_date: '',
    thoi_gian_cong_tac: 0,
    so_nam_sau_ts: 0,
    so_gio_giang_chuan: 0,
    so_hoc_vien_thac_si_huong_dan: 0,
    so_ncs_tien_si_huong_dan: 0,
    so_de_tai_cap_bo: 0,
    so_de_tai_cap_co_so: 0,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Initialize form data when currentProfile changes
  useEffect(() => {
    if (currentProfile && isOpen) {
      // Format birth_date to YYYY-MM-DD for input[type="date"]
      const birthDate = currentProfile.birth_date 
        ? new Date(currentProfile.birth_date).toISOString().split('T')[0]
        : ''

      setFormData({
        full_name: currentProfile.full_name || '',
        phone_number: currentProfile.phone_number || '',
        birth_date: birthDate,
        thoi_gian_cong_tac: currentProfile.thoi_gian_cong_tac || 0,
        so_nam_sau_ts: currentProfile.so_nam_sau_ts || 0,
        so_gio_giang_chuan: currentProfile.so_gio_giang_chuan || 0,
        so_hoc_vien_thac_si_huong_dan: currentProfile.so_hoc_vien_thac_si_huong_dan || 0,
        so_ncs_tien_si_huong_dan: currentProfile.so_ncs_tien_si_huong_dan || 0,
        so_de_tai_cap_bo: currentProfile.so_de_tai_cap_bo || 0,
        so_de_tai_cap_co_so: currentProfile.so_de_tai_cap_co_so || 0,
      })
      setError('')
      setSuccess('')
    }
  }, [currentProfile, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.full_name.trim()) {
      setError('Vui lòng nhập họ và tên')
      return
    }

    if (!formData.phone_number.trim()) {
      setError('Vui lòng nhập số điện thoại')
      return
    }

    if (!formData.birth_date) {
      setError('Vui lòng chọn ngày sinh')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('EditProfileModal: Updating profile...')
      const updatedProfile = await UserProfileApiService.updateUserProfile(formData)
      console.log('EditProfileModal: Profile updated successfully:', updatedProfile)
      
      setSuccess('Cập nhật hồ sơ thành công!')
      
      // The API service now guarantees we get valid data or throws an error
      onProfileUpdated(updatedProfile)
      
      // Close modal after brief delay to show success message
      setTimeout(() => {
        onClose()
      }, 800)
    } catch (err) {
      console.error('EditProfileModal: Update error:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật hồ sơ')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl">Chỉnh sửa hồ sơ cá nhân</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Cập nhật thông tin hồ sơ cá nhân của bạn.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-full_name">Họ và tên *</Label>
                <Input
                  id="edit-full_name"
                  name="full_name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone_number">Số điện thoại *</Label>
                <Input
                  id="edit-phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-birth_date">Ngày sinh *</Label>
                <Input
                  id="edit-birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-thoi_gian_cong_tac">Thời gian công tác (năm)</Label>
                <Input
                  id="edit-thoi_gian_cong_tac"
                  name="thoi_gian_cong_tac"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.thoi_gian_cong_tac}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Thông tin học thuật */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin học thuật</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-so_nam_sau_ts">Số năm sau Tiến sĩ</Label>
                <Input
                  id="edit-so_nam_sau_ts"
                  name="so_nam_sau_ts"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.so_nam_sau_ts}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-so_gio_giang_chuan">Số giờ giảng chuẩn</Label>
                <Input
                  id="edit-so_gio_giang_chuan"
                  name="so_gio_giang_chuan"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.so_gio_giang_chuan}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-so_hoc_vien_thac_si_huong_dan">Số học viên Thạc sĩ hướng dẫn</Label>
                <Input
                  id="edit-so_hoc_vien_thac_si_huong_dan"
                  name="so_hoc_vien_thac_si_huong_dan"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.so_hoc_vien_thac_si_huong_dan}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-so_ncs_tien_si_huong_dan">Số NCS Tiến sĩ hướng dẫn</Label>
                <Input
                  id="edit-so_ncs_tien_si_huong_dan"
                  name="so_ncs_tien_si_huong_dan"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.so_ncs_tien_si_huong_dan}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-so_de_tai_cap_bo">Số đề tài cấp Bộ</Label>
                <Input
                  id="edit-so_de_tai_cap_bo"
                  name="so_de_tai_cap_bo"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.so_de_tai_cap_bo}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-so_de_tai_cap_co_so">Số đề tài cấp cơ sở</Label>
                <Input
                  id="edit-so_de_tai_cap_co_so"
                  name="so_de_tai_cap_co_so"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.so_de_tai_cap_co_so}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Cập nhật'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
