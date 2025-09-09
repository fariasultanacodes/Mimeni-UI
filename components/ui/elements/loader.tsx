import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: number
  className?: string
}

export function Loader({ size = 24, className }: LoaderProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      style={{ width: size, height: size }}
    />
  )
}
