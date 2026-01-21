'use client';

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"

export default function LoginPage() {
    const router = useRouter()
    const { signIn, user } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Redirect to blog when already signed in
    useEffect(() => {
        if (user) {
            router.push("/blog");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await signIn(email, password)
            router.push("/blog")
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to sign in"
            setError(errorMessage)
            setLoading(false)
        }
    }

    // While redirecting or already signed in, avoid flashing the form
    if (user) {
        return null
    }

    return (
        <div className="flex min-h-screen flex-col">

            <main className="flex-1 flex items-center justify-center py-16 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome back</CardTitle>
                        <CardDescription>Sign in to your account to continue</CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mb-6"
                                />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                            <p className="text-sm text-muted-foreground text-center">
                                Don&apos;t have an account?{" "}
                                <Link href="/sign-up" className="text-foreground underline underline-offset-4 hover:text-foreground/80">
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </main>
            <Footer />
        </div>
    )

}

