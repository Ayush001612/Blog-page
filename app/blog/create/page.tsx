"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { createPost } from "@/lib/blog-store"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send } from "lucide-react"


const categories = ["Technology", "Design", "Lifestyle", "Travel", "Business", "Health", "General", "Coding"]
export default function CreateBlogPage() {
    const router = useRouter()
    const { user, loading } = useAuth()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (!title.trim() || !content.trim()) {
            setError("Please fill in all required fields")
            return
        }

        setSubmitting(true)
        setError("")

        try {
            const excerpt = content.slice(0, 150) + (content.length > 150 ? "..." : "")
            const newPost = await createPost({
                title: title.trim(),
                content: content.trim(),
                excerpt,
                category: category || "General",
                authorId: user.uid,
                authorName: user.displayName || "Anonymous",
            })
            router.push(`/blog/${newPost.id}`)
        } catch (err) {
            console.error("Error creating post:", err)
            setError("Failed to create post. Please try again.")
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">

                <main className="flex-1 container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-2xl mx-auto animate-pulse">
                        <div className="h-8 bg-muted rounded w-1/3 mb-8" />
                        <div className="space-y-4">
                            <div className="h-10 bg-muted rounded" />
                            <div className="h-10 bg-muted rounded" />
                            <div className="h-40 bg-muted rounded" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col">

                <main className="flex-1 container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
                        <p className="text-muted-foreground mb-6">You need to be signed in to write a blog post.</p>
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <div className="container mx-auto py-16 md:px-6 px-4">
                    <div className="max-w-2xl mx-auto">
                        <Link href="/app/blog/page.tsx" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog</Link>
                        <h1 className="text-3xl font-bold tracking-tight mb-8">Write a new post</h1>

                        <form onSubmit={handleSubmit} className="spacce-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input type="text" placeholder="Enter your post title" value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required />
                            </div>
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content *</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Write your blog post content here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="min-h-[300px]"
                                    required
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <div className="flex gap-3 pt-6">
                                <Button type="submit" disabled={submitting}>
                                    <Send className="h-4 w-4 mr-2" />
                                    {submitting ? "Publishing..." : "Publish Post"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.push("/blog")}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}