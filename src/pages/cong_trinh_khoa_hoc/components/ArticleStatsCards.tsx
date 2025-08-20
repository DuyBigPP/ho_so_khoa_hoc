import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Award, 
  User, 
  BookOpen,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { type ArticleStats } from '@/service/articles'

interface ArticleStatsCardsProps {
  stats: ArticleStats | null
  isLoading: boolean
}

export function ArticleStatsCards({ stats, isLoading }: ArticleStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Không có dữ liệu
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng bài báo</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.total_articles}</div>
            <p className="text-xs text-muted-foreground">
              Đã đăng trên {stats.summary.total_journals} tạp chí
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng điểm</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.total_points}</div>
            <p className="text-xs text-muted-foreground">
              Điểm tích lũy từ các bài báo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tác giả chính</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.main_author_count}</div>
            <p className="text-xs text-muted-foreground">
              Số bài làm tác giả chính
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạp chí khác nhau</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.total_journals}</div>
            <p className="text-xs text-muted-foreground">
              Số tạp chí đã đăng bài
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status and Year Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Theo trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.by_status.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    item.status === 'verified_auto' || item.status === 'verified_manual' 
                      ? 'default' 
                      : item.status === 'pending' 
                        ? 'secondary' 
                        : 'destructive'
                  }>
                    {item.status === 'pending' && 'Chờ duyệt'}
                    {item.status === 'verified_auto' && 'Đã duyệt tự động'}
                    {item.status === 'verified_manual' && 'Đã duyệt thủ công'}
                    {item.status === 'rejected' && 'Từ chối'}
                    {!['pending', 'verified_auto', 'verified_manual', 'rejected'].includes(item.status) && item.status}
                  </Badge>
                </div>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By Year */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Theo năm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.by_year.map((item) => (
              <div key={item.year} className="flex items-center justify-between">
                <span className="font-medium">{item.year}</span>
                <div className="flex items-center gap-3 text-sm">
                  <span>{item.count} bài</span>
                  <Badge variant="outline">{item.total_points} điểm</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Journals */}
      {stats.top_journals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Tạp chí hàng đầu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.top_journals.map((journal) => (
                <div key={journal.journal_name} className="flex items-center justify-between">
                  <span className="font-medium">{journal.journal_name}</span>
                  <Badge variant="outline">{journal.count} bài</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
