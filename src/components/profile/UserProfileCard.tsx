import { } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Target,
  Edit
} from 'lucide-react'
import { type UserProfile } from '@/service/user_profile'
import { AvatarUpload } from './AvatarUpload'

interface UserProfileCardProps {
  profile: UserProfile
  className?: string
  onEditClick?: () => void
  onProfileUpdated?: (updatedProfile: UserProfile) => void
}

export function UserProfileCard({ profile, className, onEditClick, onProfileUpdated }: UserProfileCardProps) {
  // Early return if no profile data
  if (!profile) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Không có dữ liệu hồ sơ
          </div>
        </CardContent>
      </Card>
    )
  }

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa cập nhật'
    try {
      return new Date(dateString).toLocaleDateString('vi-VN')
    } catch {
      return 'Không hợp lệ'
    }
  }



  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <AvatarUpload 
            currentProfile={profile}
            onAvatarUpdated={onProfileUpdated || (() => {})}
            size="md"
            showUploadButton={false}
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{profile.full_name || 'Chưa có tên'}</CardTitle>
              {onEditClick && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditClick}
                  className="h-8 gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{profile.email || 'Chưa có email'}</span>
              </div>
              {profile.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{profile.phone_number}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Thông tin cá nhân */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Thông tin cá nhân
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Ngày sinh:</span>
              <span className="font-medium">{formatDate(profile.birth_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Thời gian công tác:</span>
              <span className="font-medium">{profile.thoi_gian_cong_tac || 0} năm</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Thông tin học thuật */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Thông tin học thuật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Số năm sau TS:</span>
              <span className="font-medium">{profile.so_nam_sau_ts || 0} năm</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Số giờ giảng chuẩn:</span>
              <span className="font-medium">{profile.so_gio_giang_chuan || 0} giờ</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Hướng dẫn học viên */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Hướng dẫn học viên
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">HV Thạc sĩ:</span>
              <span className="font-medium">{profile.so_hoc_vien_thac_si_huong_dan || 0} người</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">NCS Tiến sĩ:</span>
              <span className="font-medium">{profile.so_ncs_tien_si_huong_dan || 0} người</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Đề tài nghiên cứu */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Đề tài nghiên cứu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Đề tài cấp Bộ:</span>
              <span className="font-medium">{profile.so_de_tai_cap_bo || 0} đề tài</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Đề tài cấp cơ sở:</span>
              <span className="font-medium">{profile.so_de_tai_cap_co_so || 0} đề tài</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Thông tin hệ thống */}
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Tạo tài khoản: {formatDate(profile.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
