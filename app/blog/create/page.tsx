"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { createPost } from "@/lib/blog-store"
import { uploadImage } from "@/lib/image-upload"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, Upload, X } from "lucide-react"


const categories = ["Technology", "Design", "Lifestyle", "Travel", "Business", "Health", "General", "Coding"]
export default function CreateBlogPage() {
    const router = useRouter()
    const { user, loading } = useAuth()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file")
                return
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB")
                return
            }
            setImageFile(file)
            setError("")
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

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
            let imageUrl: string | undefined

            // Upload image if selected (non-blocking - post will be created even if upload fails)
            if (imageFile) {
                setUploadingImage(true)
                try {
                    imageUrl = await uploadImage(imageFile, user.uid)
                    console.log("Image uploaded successfully:", imageUrl)
                } catch (err) {
                    console.error("Error uploading image:", err)
                    // Don't block post creation if image upload fails
                    setError("Warning: Image upload failed, but post will be created without image.")
                    // Continue to create post without image
                } finally {
                    setUploadingImage(false)
                }
            }

            // Create post regardless of image upload status
            const excerpt = content.slice(0, 150) + (content.length > 150 ? "..." : "")
            console.log("Creating post with data:", {
                title: title.trim(),
                category: category || "General",
                hasImage: !!imageUrl
            })
            
            const newPost = await createPost({
                title: title.trim(),
                content: content.trim(),
                excerpt,
                category: category || "General",
                authorId: user.uid,
                authorName: user.displayName || "Anonymous",
                ...(imageUrl != null && imageUrl !== "" ? { imageUrl } : {}),
            })
            
            console.log("Post created successfully:", newPost.id)
            router.push(`/blog/${newPost.id}`)
        } catch (err) {
            console.error("Error creating post:", err);
            let errorMessage = "Failed to create post. Please try again.";
            if (err instanceof Error) {
                errorMessage = err.message;
                // Surface Firebase permission/config errors
                const fb = err as { code?: string; message?: string };
                if (fb.code === "permission-denied") {
                    errorMessage = "Permission denied. Check Firestore rules allow authenticated users to create posts.";
                } else if (fb.code === "unavailable" || fb.message?.includes("FIRESTORE")) {
                    errorMessage = "Cannot reach Firestore. Check your connection and Firebase config.";
                }
            }
            setError(errorMessage);
            setSubmitting(false);
            setUploadingImage(false);
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
                            <Link href="/sign-in">Sign In</Link>
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
                        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog</Link>
                        <h1 className="text-3xl font-bold tracking-tight mb-8">Write a new post</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="image">Featured Image (Optional)</Label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {!imagePreview ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Image
                                    </Button>
                                ) : (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- data: URLs not supported by next/image */}
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={removeImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 1200x630px. Max size: 5MB
                                </p>
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

                            {error && (
                                <div className={`p-3 rounded-md text-sm ${
                                    error.includes("Warning") 
                                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20" 
                                        : "bg-destructive/10 text-destructive"
                                }`}>
                                    {error}
                                </div>
                            )}
                            {uploadingImage && (
                                <div className="p-3 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm">
                                    Uploading image... This may take a moment.
                                </div>
                            )}

                            <div className="flex gap-3 pt-6">
                                <Button type="submit" disabled={submitting || uploadingImage}>
                                    <Send className="h-4 w-4 mr-2" />
                                    {uploadingImage ? "Uploading image..." : submitting ? "Publishing..." : "Publish Post"}
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