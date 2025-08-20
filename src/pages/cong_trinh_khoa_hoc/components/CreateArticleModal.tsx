import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, FileText } from 'lucide-react'
import { ArticleApiService, type CreateArticleRequest } from '@/service/articles'
import { FieldsApiService, type FieldOfStudy } from '@/service/fields'

interface CreateArticleModalProps {
  isOpen: boolean
  onClose: () => void
  onArticleCreated: () => void
}

export function CreateArticleModal({ 
  isOpen, 
  onClose, 
  onArticleCreated 
}: CreateArticleModalProps) {
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    journal_name: '',
    publisher: '',
    field_of_study: '',
    publication_date: '',
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    is_main_author: true,
    co_authors: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Fields of study state
  const [fieldsOfStudy, setFieldsOfStudy] = useState<FieldOfStudy[]>([])
  const [isLoadingFields, setIsLoadingFields] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user makes selection
    if (error) setError('')
    if (success) setSuccess('')
  }

  const loadFieldsOfStudy = async () => {
    try {
      setIsLoadingFields(true)
      console.log('CreateArticleModal: Loading fields of study...')
      
      const fields = await FieldsApiService.getFieldsOfStudy()
      console.log('CreateArticleModal: Fields loaded:', fields)
      
      setFieldsOfStudy(fields)
    } catch (err) {
      console.error('CreateArticleModal: Error loading fields:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách lĩnh vực')
    } finally {
      setIsLoadingFields(false)
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_main_author: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề bài báo')
      return
    }

    if (!formData.journal_name.trim()) {
      setError('Vui lòng nhập tên tạp chí')
      return
    }

    if (!formData.publication_date) {
      setError('Vui lòng chọn ngày xuất bản')
      return
    }

    if (!formData.field_of_study.trim()) {
      setError('Vui lòng nhập lĩnh vực nghiên cứu')
      return
    }

    if (!formData.publisher.trim()) {
      setError('Vui lòng nhập nhà xuất bản')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('CreateArticleModal: Creating article...')
      const newArticle = await ArticleApiService.createArticle(formData)
      console.log('CreateArticleModal: Article created successfully:', newArticle)
      
      setSuccess('Đăng bài báo thành công!')
      
      // Close modal after brief delay to show success message
      setTimeout(() => {
        onArticleCreated()
      }, 800)
    } catch (err) {
      console.error('CreateArticleModal: Create error:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng bài báo')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Load fields of study when modal opens
  useEffect(() => {
    if (isOpen && fieldsOfStudy.length === 0) {
      loadFieldsOfStudy()
    }
  }, [isOpen, fieldsOfStudy.length])

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form
      setFormData({
        title: '',
        journal_name: '',
        publisher: '',
        field_of_study: '',
        publication_date: '',
        volume: '',
        issue: '',
        pages: '',
        doi: '',
        is_main_author: true,
        co_authors: ''
      })
      setError('')
      setSuccess('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl">Đăng bài báo khoa học</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Thêm thông tin bài báo khoa học của bạn vào hồ sơ.
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
            <h3 className="text-lg font-medium">Thông tin bài báo</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-title">Tiêu đề bài báo *</Label>
                <Input
                  id="create-title"
                  name="title"
                  type="text"
                  placeholder="Nhập tiêu đề bài báo"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-journal_name">Tên tạp chí *</Label>
                  <Input
                    id="create-journal_name"
                    name="journal_name"
                    type="text"
                    placeholder="Nhập tên tạp chí"
                    value={formData.journal_name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-publisher">Nhà xuất bản *</Label>
                  <Input
                    id="create-publisher"
                    name="publisher"
                    type="text"
                    placeholder="Nhập nhà xuất bản"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-field_of_study">Lĩnh vực nghiên cứu *</Label>
                  <Select 
                    value={formData.field_of_study} 
                    onValueChange={(value) => handleSelectChange('field_of_study', value)}
                    disabled={isSubmitting || isLoadingFields}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        isLoadingFields 
                          ? "Đang tải..." 
                          : "Chọn lĩnh vực nghiên cứu"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldsOfStudy.map((field) => (
                        <SelectItem key={field.id} value={field.name}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingFields && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Đang tải danh sách lĩnh vực...
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-publication_date">Ngày xuất bản *</Label>
                  <Input
                    id="create-publication_date"
                    name="publication_date"
                    type="date"
                    value={formData.publication_date}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Chi tiết xuất bản */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Chi tiết xuất bản</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-volume">Tập</Label>
                <Input
                  id="create-volume"
                  name="volume"
                  type="text"
                  placeholder="Nhập số tập"
                  value={formData.volume}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-issue">Số</Label>
                <Input
                  id="create-issue"
                  name="issue"
                  type="text"
                  placeholder="Nhập số phát hành"
                  value={formData.issue}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-pages">Trang</Label>
                <Input
                  id="create-pages"
                  name="pages"
                  type="text"
                  placeholder="VD: 1-15"
                  value={formData.pages}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-doi">DOI</Label>
              <Input
                id="create-doi"
                name="doi"
                type="text"
                placeholder="Nhập DOI (nếu có)"
                value={formData.doi}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Separator />

          {/* Thông tin tác giả */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin tác giả</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="create-is_main_author"
                checked={formData.is_main_author}
                onCheckedChange={handleCheckboxChange}
                disabled={isSubmitting}
              />
              <Label htmlFor="create-is_main_author" className="text-sm font-normal">
                Tôi là tác giả chính
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-co_authors">Đồng tác giả</Label>
              <Textarea
                id="create-co_authors"
                name="co_authors"
                placeholder="Nhập danh sách đồng tác giả (phân cách bằng dấu phẩy)"
                value={formData.co_authors}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
              />
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
                'Đăng bài'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
