import type React from "react"
import { Loader2 } from "lucide-react"

interface LoadingIconProps {
  className?: string
}

export const LoadingIcon: React.FC<LoadingIconProps> = ({ className = "w-4 h-4" }) => {
  return <Loader2 className={`${className} animate-spin`} />
}
