import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Input } from "@/components/ui/input"

const posts = [
  {
    title: "Getting Started with Modern UI",
    description: "An introductory guide to building clean and responsive user interfaces using modern tools.",
    date: "Jan 15, 2026",
    readTime: "4 min read"
  },
  {
    title: 'Building Accessible Components with Radix UI',
    description:
      'Learn how to create fully accessible UI components using Radix primitives and Tailwind CSS.',
    date: 'Jan 10, 2026',
    readTime: '5 min read',
  },
  {
    title: 'The Art of Minimal Design',
    description:
      'Exploring the principles of minimalism in modern web design and why less is truly more.',
    date: 'Jan 5, 2026',
    readTime: '8 min read',
  },
  {
    title: 'Server Components Deep Dive',
    description:
      'Understanding React Server Components and how they change the way we build applications.',
    date: 'Dec 28, 2025',
    readTime: '12 min read',
  },
];
export default function Home() {
  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <section
          id='hero'
          className='container mx-auto px-4 py-24 md:px-6 md:py-32'
        >
          <div className='text-center max-w-3xl space-y-6 mx-auto'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance'>
              Thoughts on design, code, and everything in between.
            </h1>
            <p className='text-muted-foreground md:text-xl max-w-2xl mx-auto text-pretty text-lg'>
              A curated collection of articles exploring modern web development,
              UI/UX design, and the creative process.
            </p>
            <div className='pt-4'>
              <Button size='lg' className='rounded-full px-10 py-5'>
                Read Latest Posts
              </Button>
            </div>
          </div>
        </section>

        <section
          id='featured-posts'
          className='container mx-auto px-4 md:px-6 py-16 md:py-24'
        >
          <Separator className='mb-15 max-w-150 mx-auto' />
          <div className='space-y-8'>
            <div className='space-y-2'>
              <h2 className='font-bold text-2xl md:text-3xl tracking-tight'>
                Featured Posts
              </h2>
              <p className='text-muted-foreground'>
                Handpicked articles worth your time.
              </p>
            </div>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
              {posts.map((post) => (
                <Card
                  key={post.title}
                  className='group relative overflow-hidden cursor-pointer border-border/70 bg-card/80 backdrop-blur-xs transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10'
                >
                  <CardHeader className='space-y-2'>
                    <div className='flex item-center gap-2 text-xs text-muted-foreground'>
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className='text-lg leading-snug group-hover:text-foreground/80 transition-colors'>
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='text-sm leading-relaxed'>
                      {post.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className='container py-20'>
          <Separator className='mb-15 max-w-150 mx-auto' />
          <div className='max-w-xl mx-auto text-center space-y-6'>
            <div className='space-y-2'>
            <Mail className="h-6 w-6 text-white dark:text-slate-900" />
            <h2 className="text-3xl mb-3 md:text-5xl font-bold tracking-tight">Stay in the loop</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Get notified when I publish new articles. No spam, unsubscribe anytime.
          </p>
            </div>
            <form className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto '>
            <Input type="email" placeholder="Enter your email" className="flex-1" />
          <Button type="submit" className="sm:w-auto">
            Subscribe
          </Button>
            </form>
          </div>
        </section>

        {/* footer */}
        <footer className="container mx-auto px-4 md:px-6 py-8">
      <Separator className="mb-8" />
      <p className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Commit & Coffee. All rights reserved.
      </p>
    </footer>
      </div>
    </>
  );
}
