"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { getPosts } from "@/lib/blog-store"
import { PenLine, Calendar, User } from "lucide-react"
import type { BlogPost } from "@/lib/types"

export default function BlogPage() {
    const { user } = useAuth()
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            const label = "fetchPosts"
            console.time(label)
            try{
                const data = await getPosts()
                setPosts(data)
            }
            catch(error){
                console.error(error);
            }
            finally{
                console.timeEnd(label)

                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Blog</h1>
                                <p className="text-muted-foreground text-lg">Thoughts, stories, and ideas from our community.</p>
                            </div>

                            {user && (
                                <Button asChild>
                                    <Link href="/blog/create" className="gap-2">
                                        <PenLine className="h-4 w-4" />
                                        Write a Post
                                    </Link>
                                </Button>
                            )}
                        </div>
                        {loading ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-16/10 bg-muted rounded-lg mb-4" />
                                        <div className="h-4 bg-muted rounded w-1/4 mb-3" />
                                        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-muted rounded w-full" />
                                    </div>
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-border rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                                <p className="text-muted-foreground mb-6">Be the first to share your thoughts!</p>
                                {user ? (
                                    <Button asChild>
                                        <Link href="/blog/create">Write the first post</Link>
                                    </Button>
                                ) : (
                                    <Button asChild>
                                        <Link href="/blog/create">Sign In to write</Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <Link key={post.id} href={`/blog/${post.id}`} className="group">
                                        <article className="h-full flex flex-col">
                                            <div className="aspect-16/10 bg-muted rounded-lg mb-4 overflow-hidden relative">
                                                <Image
                                                    src={`/.jpg?height=300&width=480&query=${encodeURIComponent(post.title)}`}
                                                    alt={post.title}
                                                    fill
                                                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <Badge variant="outline" className="w-fit mb-3">
                                                {post.category || "General"}
                                            </Badge>
                                            <h2 className="text-xl font-semibold mb-2 group-hover:text-muted-foreground transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {post.authorName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {post.createdAt?.toLocaleDateString()}
                                                </span>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )
                        }
                    </div>


                </section>

            </main>
            <Footer />
        </div>
    )
}