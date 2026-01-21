import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="container mx-auto px-4 md:px-6 py-8">
      <Separator className="mb-8" />
      <p className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Commit & Coffee. All rights reserved.
      </p>
    </footer>
  )
}