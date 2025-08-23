"use client"

import { useState } from "react"
import { UpdateWithStartup } from "@/lib/types/database"
import { UpdateCard } from "./update-card"
import { UpdateModal } from "./update-modal"

interface UpdatesFeedProps {
  updates: UpdateWithStartup[]
}

export function UpdatesFeed({ updates }: UpdatesFeedProps) {
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateWithStartup | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr items-stretch">
        {updates.map((update) => (
          <UpdateCard
            key={update.id}
            update={update}
            onClick={() => setSelectedUpdate(update)}
          />
        ))}
      </div>

      {updates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No updates yet. Be the first startup to share your progress!
          </p>
        </div>
      )}

      <UpdateModal
        update={selectedUpdate}
        onClose={() => setSelectedUpdate(null)}
      />
    </>
  )
} 