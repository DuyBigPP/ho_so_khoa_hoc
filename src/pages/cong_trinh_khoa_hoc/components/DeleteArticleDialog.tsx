import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { ArticleApiService, type Article } from '@/service/articles'

interface DeleteArticleDialogProps {
  isOpen: boolean
  onClose: () => void
  article: Article
  onArticleDeleted: () => void
}

export function DeleteArticleDialog({
  isOpen,
  onClose,
  article,
  onArticleDeleted
}: DeleteArticleDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')

    try {
      console.log('DeleteArticleDialog: Deleting article...', article.id)
      await ArticleApiService.deleteArticle(article.id)
      console.log('DeleteArticleDialog: Article deleted successfully')
      
      onArticleDeleted()
    } catch (err) {
      console.error('DeleteArticleDialog: Delete error:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa bài báo')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      setError('')
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa bài báo</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Bạn có chắc chắn muốn xóa bài báo này? Hành động này không thể hoàn tác.
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-medium text-sm">{article.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {article.journal_name} • {new Date(article.publication_date).getFullYear()}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa bài báo'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
