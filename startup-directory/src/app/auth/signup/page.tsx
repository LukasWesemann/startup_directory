import { SignUpForm } from "@/components/auth/signup-form"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Startup Pulse Logo" className="h-12 w-auto -mt-1" />
              <div className="flex items-baseline gap-2">
                <img src="/MLAI_textlogo.png" alt="MLAI" className="h-6 w-auto" />
                <span className="text-2xl font-normal text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                  Valley
                </span>
              </div>
            </div>
            <MainNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">Join the Directory</h1>
              <p className="text-muted-foreground">
                Create your startup profile and start sharing updates
              </p>
            </div>
            
            <SignUpForm />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/auth/signin" 
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 