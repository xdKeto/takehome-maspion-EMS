import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6" role="alert">
      <div>
        <h2 className="text-lg font-semibold text-destructive">Failed to load data</h2>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      <Button type="button" variant="outline" onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
  )
}

export default ErrorState
