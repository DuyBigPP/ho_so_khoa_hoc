import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { UploadDocumentModal } from './UploadDocumentModal'

interface DocumentUploadCardProps {
  className?: string
}

export function DocumentUploadCard({ className }: DocumentUploadCardProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)

  const handleOpenModal = () => {
    setShowUploadModal(true)
  }

  const handleCloseModal = () => {
    setShowUploadModal(false)
  }

  const handleUploadSuccess = (result: unknown) => {
    console.log('DocumentUploadCard: Upload successful:', result)
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Tải lên tài liệu</span>
            </div>
            <Button onClick={handleOpenModal} size="sm">
              Chọn file
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={handleCloseModal}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  )
}
