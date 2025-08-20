import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Loader2, 
  Upload, 
  FileText, 
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { DocumentApiService, type UploadDocumentRequest } from '@/service/document'

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess?: (result: any) => void
}

// Document types based on common research document types
const DOCUMENT_TYPES = [
  { value: 'research_paper', label: 'Bài báo nghiên cứu' },
  { value: 'conference_paper', label: 'Bài báo hội nghị' },
  { value: 'book_chapter', label: 'Chương sách' },
  { value: 'patent', label: 'Bằng sáng chế' },
  { value: 'technical_report', label: 'Báo cáo kỹ thuật' },
  { value: 'thesis', label: 'Luận án/Luận văn' },
  { value: 'project_report', label: 'Báo cáo đề tài' },
  { value: 'other', label: 'Khác' }
]

export function UploadDocumentModal({ 
  isOpen, 
  onClose, 
  onUploadSuccess 
}: UploadDocumentModalProps) {
  const [formData, setFormData] = useState({
    document_type: '',
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear messages when user makes changes
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = DocumentApiService.validateFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'File không hợp lệ')
      return
    }

    setSelectedFile(file)
    setError('')
    setSuccess('')
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.document_type) {
      setError('Vui lòng chọn loại tài liệu')
      return
    }

    if (!selectedFile) {
      setError('Vui lòng chọn file để tải lên')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const uploadData: UploadDocumentRequest = {
        work_id: 1, // Default work_id since it's not required from user
        document_type: formData.document_type,
        file: selectedFile
      }

      console.log('UploadDocumentModal: Starting upload...')
      const result = await DocumentApiService.uploadDocument(uploadData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      console.log('UploadDocumentModal: Upload successful:', result)
      setSuccess('Tải lên tài liệu thành công!')
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(result)
      }

      // Close modal after short delay
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)

    } catch (err) {
      console.error('UploadDocumentModal: Upload error:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải lên tài liệu')
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      document_type: '',
    })
    setSelectedFile(null)
    setError('')
    setSuccess('')
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      onClose()
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Upload className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl">Tải lên tài liệu</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Tải lên tài liệu cho công trình khoa học của bạn.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}



          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="document_type">Loại tài liệu *</Label>
            <Select 
              value={formData.document_type} 
              onValueChange={(value) => handleInputChange('document_type', value)}
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại tài liệu" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* File Upload */}
          <div className="space-y-4">
            <Label>File tài liệu *</Label>
            
            {!selectedFile ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Kéo thả file hoặc click để chọn
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  PDF, Word, Excel, ảnh (tối đa 10MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Chọn file
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                />
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {DocumentApiService.formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  {!isUploading && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đang tải lên...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isUploading}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || !selectedFile}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Tải lên
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
