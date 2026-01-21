"use client"

import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hammer, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <main className="flex-1">
        {/* Under Maintenance Section */}
        <section className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary/5 rounded-full" />
                <Hammer className="w-10 h-10 text-primary animate-bounce" />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                About Page Coming Soon
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                We&apos;re currently building something amazing here. Check back soon to learn more about
                our story, mission, and values.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/blog" className="gap-2">
                  Read The Blog <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
            </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
