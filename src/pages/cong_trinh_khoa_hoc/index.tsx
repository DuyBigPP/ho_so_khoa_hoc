import { useState, useEffect } from 'react'
import { DocumentUploadCard } from './components/DocumentUploadCard'
import { CreateArticleCard } from './components/CreateArticleCard'
import { ArticlesTable } from './components/ArticlesTable'
import { ArticleStatsCards } from './components/ArticleStatsCards'
import { ArticleApiService, type Article, type ArticleStats } from '@/service/articles'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, FileText, Upload } from 'lucide-react'

const CongTrinhKhoaHoc = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [stats, setStats] = useState<ArticleStats | null>(null)
  const [isLoadingArticles, setIsLoadingArticles] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [error, setError] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)

  const loadArticles = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setIsLoadingArticles(true)
      setError('')
      console.log('CongTrinhKhoaHoc: Loading articles...', { page, size })
      
      const offset = (page - 1) * size
      const response = await ArticleApiService.getArticles({ 
        limit: size, 
        offset 
      })
      console.log('CongTrinhKhoaHoc: Articles loaded:', response)
      
      setArticles(response.articles)
      setTotal(response.total)
      setCurrentPage(page)
      setPageSize(size)
    } catch (err) {
      console.error('CongTrinhKhoaHoc: Error loading articles:', err)
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách bài báo')
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const loadStats = async () => {
    try {
      setIsLoadingStats(true)
      console.log('CongTrinhKhoaHoc: Loading stats...')
      
      const statsData = await ArticleApiService.getArticleStats()
      console.log('CongTrinhKhoaHoc: Stats loaded:', statsData)
      
      setStats(statsData)
    } catch (err) {
      console.error('CongTrinhKhoaHoc: Error loading stats:', err)
      // Don't set error for stats, just keep it null
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleRefresh = () => {
    loadArticles(currentPage, pageSize)
    loadStats()
  }

  const handlePageChange = (page: number) => {
    loadArticles(page, pageSize)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    loadArticles(1, newPageSize) // Reset to first page when changing page size
  }

  useEffect(() => {
    loadArticles(1, 20) // Initial load with default values
    loadStats()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Section */}
      <div className="space-y-4">
        <ArticleStatsCards stats={stats} isLoading={isLoadingStats} />
      </div>

      <Separator />

      {/* Documents Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Tài liệu</h2>
        </div>
        <DocumentUploadCard />
      </div>

      <Separator />

      {/* Articles Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Bài báo khoa học</h2>
        </div>
        
        <CreateArticleCard onArticleCreated={handleRefresh} />
        
        <ArticlesTable 
          articles={articles} 
          total={total}
          isLoading={isLoadingArticles} 
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRefresh={handleRefresh} 
        />
      </div>
    </div>
  )
}

export default CongTrinhKhoaHoc