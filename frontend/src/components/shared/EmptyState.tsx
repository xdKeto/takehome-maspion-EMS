type EmptyStateProps = {
  message: string
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <h2 className="text-lg font-semibold">{message}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        No Data.
      </p>
    </div>
  )
}

export default EmptyState
