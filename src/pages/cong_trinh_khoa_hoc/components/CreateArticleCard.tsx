import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { CreateArticleModal } from './CreateArticleModal.tsx'

interface CreateArticleCardProps {
  onArticleCreated: () => void
  className?: string
}

export function CreateArticleCard({ onArticleCreated, className }: CreateArticleCardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleOpenModal = () => {
    setShowCreateModal(true)
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
  }

  const handleArticleCreated = () => {
    onArticleCreated()
    setShowCreateModal(false)
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Đăng bài báo khoa học</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Thêm bài báo khoa học mới vào hồ sơ của bạn
                </p>
              </div>
            </div>
            <Button onClick={handleOpenModal} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Đăng bài mới
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Article Modal */}
      <CreateArticleModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onArticleCreated={handleArticleCreated}
      />
    </>
  )
}
