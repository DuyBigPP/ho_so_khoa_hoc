import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { ProfileService, type CompleteProfileRequest } from '@/service/profileService'

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState<CompleteProfileRequest>({
    full_name: user?.name || '',
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
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)

    // Basic validation
    if (!formData.full_name.trim()) {
      setError('Vui lòng nhập họ tên')
      setIsLoading(false)
      return
    }

    if (!formData.phone_number.trim()) {
      setError('Vui lòng nhập số điện thoại')
      setIsLoading(false)
      return
    }

    if (!formData.birth_date) {
      setError('Vui lòng nhập ngày sinh')
      setIsLoading(false)
      return
    }

    try {
      await ProfileService.completeProfile(formData)
      // Navigate to dashboard after successful completion
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Hoàn thiện hồ sơ</h1>
          <p className="text-muted-foreground">
            Vui lòng điền đầy đủ thông tin để hoàn thiện hồ sơ của bạn
          </p>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Điền các thông tin bắt buộc để có thể sử dụng đầy đủ chức năng của hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">Họ và tên *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>

                {/* Academic Info */}
                <div className="space-y-2">
                  <Label htmlFor="so_nam_sau_ts">Số năm sau tiến sĩ</Label>
                  <Input
                    id="so_nam_sau_ts"
                    name="so_nam_sau_ts"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.so_nam_sau_ts}
                    onChange={handleInputChange}
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="so_hoc_vien_thac_si_huong_dan">Số học viên thạc sĩ hướng dẫn</Label>
                  <Input
                    id="so_hoc_vien_thac_si_huong_dan"
                    name="so_hoc_vien_thac_si_huong_dan"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.so_hoc_vien_thac_si_huong_dan}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="so_ncs_tien_si_huong_dan">Số NCS tiến sĩ hướng dẫn</Label>
                  <Input
                    id="so_ncs_tien_si_huong_dan"
                    name="so_ncs_tien_si_huong_dan"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.so_ncs_tien_si_huong_dan}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Research Projects */}
                <div className="space-y-2">
                  <Label htmlFor="so_de_tai_cap_bo">Số đề tài cấp bộ</Label>
                  <Input
                    id="so_de_tai_cap_bo"
                    name="so_de_tai_cap_bo"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.so_de_tai_cap_bo}
                    onChange={handleInputChange}
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu thông tin...
                  </>
                ) : (
                  'Hoàn thành hồ sơ'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
