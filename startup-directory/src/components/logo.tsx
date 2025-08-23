import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <img src="/logo.png" alt="Startup Pulse Logo" className="h-12 w-auto -mt-1" />
      <div className="flex items-baseline gap-2">
        <img src="/MLAI_textlogo.png" alt="MLAI" className="h-6 w-auto" />
        <span className="text-2xl font-normal text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
          Valley
        </span>
      </div>
    </Link>
  )
} 