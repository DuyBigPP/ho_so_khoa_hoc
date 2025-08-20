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
import { Loader2, Edit } from 'lucide-react'
import { ArticleApiService, type Article, type UpdateArticleRequest } from '@/service/articles'
import { FieldsApiService, type FieldOfStudy } from '@/service/fields'

interface EditArticleModalProps {
  isOpen: boolean
  onClose: () => void
  article: Article
  onArticleUpdated: () => void
}

export function EditArticleModal({ 
  isOpen, 
  onClose, 
  article,
  onArticleUpdated 
}: EditArticleModalProps) {
  const [formData, setFormData] = useState<UpdateArticleRequest>({
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

  // Initialize form data when article changes
  useEffect(() => {
    if (article && isOpen) {
      // Format publication_date to YYYY-MM-DD for input[type="date"]
      const publicationDate = article.publication_date 
        ? new Date(article.publication_date).toISOString().split('T')[0]
        : ''

      setFormData({
        title: article.title || '',
        journal_name: article.journal_name || '',
        publisher: article.publisher || '',
        field_of_study: article.field_of_study || '',
        publication_date: publicationDate,
        volume: article.volume || '',
        issue: article.issue || '',
        pages: article.pages || '',
        doi: article.doi || '',
        is_main_author: Boolean(article.is_main_author),
        co_authors: article.co_authors || ''
      })
      setError('')
      setSuccess('')
    }
  }, [article, isOpen])

  // Load fields of study when modal opens
  useEffect(() => {
    if (isOpen && fieldsOfStudy.length === 0) {
      loadFieldsOfStudy()
    }
  }, [isOpen, fieldsOfStudy.length])

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
      console.log('EditArticleModal: Loading fields of study...')
      
      const fields = await FieldsApiService.getFieldsOfStudy()
      console.log('EditArticleModal: Fields loaded:', fields)
      
      setFieldsOfStudy(fields)
    } catch (err) {
      console.error('EditArticleModal: Error loading fields:', err)
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
      console.log('EditArticleModal: Updating article...')
      const updatedArticle = await ArticleApiService.updateArticle(article.id, formData)
      console.log('EditArticleModal: Article updated successfully:', updatedArticle)
      
      setSuccess('Cập nhật bài báo thành công!')
      
      // Close modal after brief delay to show success message
      setTimeout(() => {
        onArticleUpdated()
      }, 800)
    } catch (err) {
      console.error('EditArticleModal: Update error:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật bài báo')
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Edit className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl">Chỉnh sửa bài báo</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Cập nhật thông tin bài báo khoa học của bạn.
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
                <Label htmlFor="edit-title">Tiêu đề bài báo *</Label>
                <Input
                  id="edit-title"
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
                  <Label htmlFor="edit-journal_name">Tên tạp chí *</Label>
                  <Input
                    id="edit-journal_name"
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
                  <Label htmlFor="edit-publisher">Nhà xuất bản *</Label>
                  <Input
                    id="edit-publisher"
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
                  <Label htmlFor="edit-field_of_study">Lĩnh vực nghiên cứu *</Label>
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
                  <Label htmlFor="edit-publication_date">Ngày xuất bản *</Label>
                  <Input
                    id="edit-publication_date"
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
                <Label htmlFor="edit-volume">Tập</Label>
                <Input
                  id="edit-volume"
                  name="volume"
                  type="text"
                  placeholder="Nhập số tập"
                  value={formData.volume}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-issue">Số</Label>
                <Input
                  id="edit-issue"
                  name="issue"
                  type="text"
                  placeholder="Nhập số phát hành"
                  value={formData.issue}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-pages">Trang</Label>
                <Input
                  id="edit-pages"
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
              <Label htmlFor="edit-doi">DOI</Label>
              <Input
                id="edit-doi"
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
                id="edit-is_main_author"
                checked={formData.is_main_author}
                onCheckedChange={handleCheckboxChange}
                disabled={isSubmitting}
              />
              <Label htmlFor="edit-is_main_author" className="text-sm font-normal">
                Tôi là tác giả chính
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-co_authors">Đồng tác giả</Label>
              <Textarea
                id="edit-co_authors"
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
                'Cập nhật'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
