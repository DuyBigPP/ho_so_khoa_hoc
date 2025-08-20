import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

interface ProfileSkeletonProps {
  className?: string
}

export function ProfileSkeleton({ className }: ProfileSkeletonProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Thông tin cá nhân */}
        <div>
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        <Separator />

        {/* Thông tin học thuật */}
        <div>
          <Skeleton className="h-5 w-36 mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <Separator />

        {/* Hướng dẫn học viên */}
        <div>
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <Separator />

        {/* Đề tài nghiên cứu */}
        <div>
          <Skeleton className="h-5 w-36 mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <Separator />

        <Skeleton className="h-3 w-48" />
      </CardContent>
    </Card>
  )
}
