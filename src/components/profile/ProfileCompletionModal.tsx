import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User } from 'lucide-react'
import { ProfileService, type CompleteProfileRequest } from '@/service/profileService'
import { useUserProfile } from '@/hooks/useUserProfile'

interface ProfileCompletionModalProps {
  isOpen: boolean
  onCompleted: () => void
}

export function ProfileCompletionModal({ isOpen, onCompleted }: ProfileCompletionModalProps) {
  const { refreshProfile } = useUserProfile()
  const [formData, setFormData] = useState<CompleteProfileRequest>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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
      await ProfileService.completeProfile(formData)
      console.log('Profile completed successfully')
      
      // Refresh profile in context to get updated data
      await refreshProfile()
      
      onCompleted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật hồ sơ')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl">Hoàn thiện hồ sơ cá nhân</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Vui lòng điền đầy đủ thông tin để hoàn thiện hồ sơ và sử dụng đầy đủ tính năng của hệ thống.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ và tên *</Label>
                <Input
                  id="full_name"
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
                <Label htmlFor="phone_number">Số điện thoại *</Label>
                <Input
                  id="phone_number"
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
                <Label htmlFor="birth_date">Ngày sinh *</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thoi_gian_cong_tac">Thời gian công tác (năm)</Label>
                <Input
                  id="thoi_gian_cong_tac"
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

          {/* Thông tin học thuật */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin học thuật</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="so_nam_sau_ts">Số năm sau Tiến sĩ</Label>
                <Input
                  id="so_nam_sau_ts"
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
                <Label htmlFor="so_gio_giang_chuan">Số giờ giảng chuẩn</Label>
                <Input
                  id="so_gio_giang_chuan"
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
                <Label htmlFor="so_hoc_vien_thac_si_huong_dan">Số học viên Thạc sĩ hướng dẫn</Label>
                <Input
                  id="so_hoc_vien_thac_si_huong_dan"
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
                <Label htmlFor="so_ncs_tien_si_huong_dan">Số NCS Tiến sĩ hướng dẫn</Label>
                <Input
                  id="so_ncs_tien_si_huong_dan"
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
                <Label htmlFor="so_de_tai_cap_bo">Số đề tài cấp Bộ</Label>
                <Input
                  id="so_de_tai_cap_bo"
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
                <Label htmlFor="so_de_tai_cap_co_so">Số đề tài cấp cơ sở</Label>
                <Input
                  id="so_de_tai_cap_co_so"
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

          {/* Submit button */}
          <div className="flex justify-end pt-6">
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
                'Hoàn thành'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
