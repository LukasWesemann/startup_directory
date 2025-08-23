import Image from "next/image"

export function SponsorSection() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Sponsored by
          </h2>
        </div>
        <div className="flex items-center justify-center space-x-12 mb-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center justify-center">
              <Image
                src="/sponsor.png"
                alt={`Sponsor ${index}`}
                width={120}
                height={40}
                className="h-4 w-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 