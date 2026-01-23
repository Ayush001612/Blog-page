"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, User } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading, updateDisplayName } = useAuth()
  const [displayName, setDisplayName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in")
    } else if (user) {
      setDisplayName(user.displayName || "")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!displayName.trim()) {
      setError("Display name cannot be empty")
      return
    }

    if (displayName.trim() === user.displayName) {
      setError("No changes to save")
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      await updateDisplayName(displayName.trim())
      setSuccess("Display name updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error updating display name:", err)
      setError(err instanceof Error ? err.message : "Failed to update display name")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-2xl mx-auto animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8" />
            <div className="h-40 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto py-16 md:px-6 px-4">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>
                  Update your display name. This will be shown on your blog posts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Enter your display name"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value)
                        setError("")
                        setSuccess("")
                      }}
                      required
                      minLength={1}
                      maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground">
                      This name will appear on your blog posts and comments
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                      {success}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={saving || displayName.trim() === user.displayName}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDisplayName(user.displayName || "")
                        setError("")
                        setSuccess("")
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
