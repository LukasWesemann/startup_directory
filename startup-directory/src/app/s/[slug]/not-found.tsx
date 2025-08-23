import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Startup Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The startup profile you're looking for doesn't exist or may have been made private.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">
              Back to Directory
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button>
              Join as Startup
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 