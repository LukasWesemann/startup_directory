import { SignInForm } from "@/components/auth/signin-form"
import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <MainNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
              <p className="text-muted-foreground">
                Sign in to your startup account
              </p>
            </div>
            
            <SignInForm />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  href="/auth/signup" 
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 