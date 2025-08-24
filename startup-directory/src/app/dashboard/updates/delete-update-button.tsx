"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

interface DeleteUpdateButtonProps {
  updateId: string
  updateTitle?: string | null
}

export function DeleteUpdateButton({ updateId, updateTitle }: DeleteUpdateButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', updateId)

      if (error) {
        console.error('Error deleting update:', error)
        // You could add toast notification here
      } else {
        setOpen(false)
        router.refresh()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 cursor-pointer transition-colors">
          <Trash2 className="h-4 w-4" />
          Delete
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Update</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete this update? This action cannot be undone.
          </p>
          {updateTitle && (
            <p className="mt-2 font-medium text-foreground">
              "{updateTitle}"
            </p>
          )}
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
            className="hover:bg-muted transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="hover:bg-red-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 