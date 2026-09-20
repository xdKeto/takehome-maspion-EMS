import { Skeleton } from "@/components/ui/skeleton"

const LoadingState = () => {
  return (
    <div className="space-y-3" aria-label="" role="status">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

export default LoadingState
