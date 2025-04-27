import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full border-t py-4 text-center text-sm text-muted-foreground", className)}>
      <p>© 2025 SSD Central. All rights reserved.</p>
    </footer>
  )
} 