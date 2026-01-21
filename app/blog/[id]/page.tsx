"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { getPost, getComments, createComment, deleteComment, deletePost } from "@/lib/blog-store"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, User, MessageCircle, Trash2, Send } from "lucide-react"
import type { BlogPost, Comment } from "@/lib/types"

export default function BlogPostPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()
    const { user } = useAuth()
    const [post, setPost] = useState<BlogPost | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            const postData = await getPost(id)
            setPost(postData)
            const commentsData = await getComments(id)
            setComments(commentsData)
            setLoading(false)
        }
        loadData()
    }, [id])

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !newComment.trim()) return
        setSubmitting(true)
        try {
            await createComment({
                postId: id,
                content: newComment.trim(),
                authorId: user.uid,
                authorName: user.displayName || "Anonymous",
            })
            const updatedComments = await getComments(id)
            setComments(updatedComments)
            setNewComment("")
        }
        catch (err) {
            console.error(" Error creating comment:", err)
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!user) return
        try {
            await deleteComment(commentId)
            const updatedComments = await getComments(id)
            setComments(updatedComments)
        }
        catch (err) {
            console.error("Error deleting comment:", err)
        }
    }

    const handleDeletePost = async () => {
        if (!user || user.uid !== post?.authorId) return
        if (!confirm("Are you sure you want to delete this post?")) return

        try {
            await deletePost(id)
            router.push("/blog")
        }
        catch (err) {
            console.error("Error deleting post:", err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-3xl mx-auto animate-pulse">
                        <div className="h-4 bg-muted rounded w-24 mb-8" />
                        <div className="h-10 bg-muted rounded w-3/4 mb-4" />
                        <div className="h-4 bg-muted rounded w-1/2 mb-8" />
                        <div className="space-y-3">
                            <div className="h-4 bg-muted rounded" />
                            <div className="h-4 bg-muted rounded" />
                            <div className="h-4 bg-muted rounded w-5/6" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
                        <p className="text-muted-foreground mb-6">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                        <Button asChild>
                            <Link href="/blog">Back to Blog</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <article className="container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-3xl mx-auto">
                        <Link href="/blog"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Link>
                        <header className="mb-8">
                            <Badge variant="outline" className="mb-4">
                                {post.category || "General"}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {post.authorName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {post.createdAt?.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    {comments.length} {comments.length === 1 ? "comment" : "comments"}
                                </span>
                            </div>
                        </header>

                        <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
                            {post.content.split("\n").map((paragraph, index) => (
                                <p key={index} className="text-foreground leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        {user?.uid === post.authorId && (
                            <div className="flex gap-2 mb-8">
                                <Button variant="destructive" size="sm" onClick={handleDeletePost}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Post
                                </Button>
                            </div>
                        )}

                        <Separator className="my-8" />
                        <section>
                            {/* this is for comment icon and number of comments */}
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Comments ({comments.length})
                            </h2>

                            {user ? (
                                <form onSubmit={handleSubmitComment} className="mb-8">
                                    <Textarea
                                        placeholder="Share your thoughts..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="mb-3 min-h-[100px]"
                                    />
                                    <Button type="submit" disabled={submitting || !newComment.trim()}>
                                        <Send className="h-4 w-4 mr-2" />
                                        {submitting ? "Posting..." : "Post Comment"}
                                    </Button>
                                </form>
                            ) : (
                                <div className="bg-muted/50 rounded-lg p-6 mb-8 text-center">
                                    <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
                                    <Button asChild>
                                        <Link href="/login">Sign In</Link>
                                    </Button>
                                </div>
                            )}
                            <div className="space-y-6">
                                {comments.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">
                                        No comments yet. Be the first to share your thoughts!
                                    </p>
                                ) : (
                                    // comment card- all the comments are shown in a card format
                                    comments.map((comment) => (

                                        <div key={comment.id} className="border border-border rounded-lg p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-medium text-sm">{comment.authorName}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {comment.createdAt?.toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground">{comment.content}</p>
                                                </div>
                                                {/* Delete comment button (only for the owner of the post) */}
                                                {user?.uid === comment.authorId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )

                                                }
                                            </div>
                                        </div>
                                    )
                                    )
                                )}
                            </div>


                        </section>


                    </div>
                </article>
            </main>
        </div>
    )
}