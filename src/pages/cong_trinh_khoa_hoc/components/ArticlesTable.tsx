import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2,
  FileText,
  Calendar,
  User,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Article } from '@/service/articles'
import { EditArticleModal } from './EditArticleModal.tsx'
import { DeleteArticleDialog } from './DeleteArticleDialog.tsx'

interface ArticlesTableProps {
  articles: Article[]
  total: number
  isLoading: boolean
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onRefresh: () => void
}

export function ArticlesTable({ 
  articles, 
  total, 
  isLoading, 
  currentPage, 
  pageSize, 
  onPageChange, 
  onPageSizeChange, 
  onRefresh 
}: ArticlesTableProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'Chờ duyệt', variant: 'secondary' as const },
      'verified_auto': { label: 'Đã duyệt tự động', variant: 'default' as const },
      'verified_manual': { label: 'Đã duyệt thủ công', variant: 'default' as const },
      'rejected': { label: 'Từ chối', variant: 'destructive' as const },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: 'secondary' as const 
    }
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN')
    } catch {
      return dateString
    }
  }

  const handleEdit = (article: Article) => {
    setSelectedArticle(article)
    setShowEditModal(true)
  }

  const handleDelete = (article: Article) => {
    setSelectedArticle(article)
    setShowDeleteDialog(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedArticle(null)
  }

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false)
    setSelectedArticle(null)
  }

  const handleArticleUpdated = () => {
    onRefresh()
    handleCloseEditModal()
  }

  const handleArticleDeleted = () => {
    onRefresh()
    handleCloseDeleteDialog()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Danh sách bài báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Đang tải...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Danh sách bài báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Chưa có bài báo nào</h3>
            <p className="text-muted-foreground">
              Bạn chưa đăng bài báo khoa học nào. Hãy bắt đầu bằng cách đăng bài báo đầu tiên.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Filter articles based on search and status
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.journal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.co_authors?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate pagination info
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, total)

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Danh sách bài báo ({total})
            </CardTitle>
            
            {/* Search and Filter Toolbar */}
            <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="verified_auto">Đã duyệt tự động</SelectItem>
                  <SelectItem value="verified_manual">Đã duyệt thủ công</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px] max-w-[350px]">Tiêu đề</TableHead>
                  <TableHead className="min-w-[180px]">Tạp chí</TableHead>
                  <TableHead className="min-w-[120px]">Ngày xuất bản</TableHead>
                  <TableHead className="min-w-[140px]">Tác giả</TableHead>
                  <TableHead className="min-w-[120px]">Trạng thái</TableHead>
                  <TableHead className="min-w-[80px]">Điểm</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="max-w-[350px]">
                      <div className="space-y-1">
                        <p className="font-medium leading-tight line-clamp-2 break-words">
                          {article.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                          <span>Vol. {article.volume || 'N/A'}</span>
                          {article.issue && <span>• No. {article.issue}</span>}
                          {article.pages && <span>• pp. {article.pages}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <div className="space-y-1">
                        <p className="font-medium line-clamp-1 break-words">{article.journal_name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 break-words">{article.publisher}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(article.publication_date)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          {article.is_main_author ? (
                            <User className="h-3 w-3 text-primary" />
                          ) : (
                            <Users className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={`text-xs ${article.is_main_author ? 'font-medium' : 'text-muted-foreground'}`}>
                            {article.is_main_author ? 'Chính' : 'Đồng'}
                          </span>
                        </div>
                        {article.co_authors && (
                          <p className="text-xs text-muted-foreground line-clamp-1 break-words">
                            {article.co_authors}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(article.status)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{article.calculated_points}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(article)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(article)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex flex-col gap-4 p-4 border-t sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              <span>Hiển thị {startItem}-{endItem} trong tổng số {total} bài báo</span>
            </div>
            
            <div className="flex flex-col gap-4 items-center sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Số dòng:</span>
                <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1 px-2 min-w-[80px] justify-center">
                  <span className="text-sm whitespace-nowrap">Trang {currentPage} / {totalPages}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {selectedArticle && (
        <EditArticleModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          article={selectedArticle}
          onArticleUpdated={handleArticleUpdated}
        />
      )}

      {/* Delete Dialog */}
      {selectedArticle && (
        <DeleteArticleDialog
          isOpen={showDeleteDialog}
          onClose={handleCloseDeleteDialog}
          article={selectedArticle}
          onArticleDeleted={handleArticleDeleted}
        />
      )}
    </>
  )
}
