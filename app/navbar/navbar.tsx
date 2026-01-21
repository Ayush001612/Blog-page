'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/theme-btn';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between relative'>
          {/* Logo - Left */}
          <Link
            href='/'
            className='group relative flex items-center space-x-2 text-xl font-bold text-foreground transition-all duration-300 hover:scale-105 z-10'
          >
            <span className='relative'>
              <span className='bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary group-hover:to-primary/80'>
                Commit & Coffee
              </span>
              <span className='absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full'></span>
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className='hidden md:flex md:items-center md:space-x-1 absolute left-1/2 -translate-x-1/2'>
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative px-4 py-2 text-sm font-medium text-foreground/80 transition-all duration-300',
                  'hover:text-foreground hover:scale-105',
                  'before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:bg-primary before:transition-all before:duration-300',
                  'hover:before:w-full'
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <span className='relative z-10'>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Right */}
          <div className='hidden md:flex md:items-center md:gap-2 z-10'>
            <Button
              variant='outline'
              className='bg-white text-black border-black hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-900'
              asChild
            >
              <Link href='/sign-in'>Sign In</Link>
            </Button>
            <Button
              className='bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100'
              asChild
            >
              <Link href='/sign-up'>Sign Up</Link>
            </Button>
            <ModeToggle />
          </div>

          {/* Mobile menu button and ModeToggle */}
          <div className='md:hidden flex items-center gap-2'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 text-foreground transition-all duration-300 hover:scale-110 hover:text-primary'
              aria-label='Toggle menu'
            >
              {isOpen ? (
                <X className='h-6 w-6 animate-in fade-in-0 duration-500' />
              ) : (
                <Menu className='h-6 w-6 animate-in fade-in-0 duration-500' />
              )}
            </button>
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-500 ease-in-out',
            isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className='flex flex-col space-y-1 pb-4 pt-2'>
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'group relative px-4 py-3 text-base font-medium text-foreground/80 transition-all duration-300',
                  'hover:bg-accent hover:text-foreground hover:translate-x-2 rounded-md',
                  'before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:transition-all before:duration-300',
                  'hover:before:w-1'
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className='relative z-10 pl-2'>{item.name}</span>
              </Link>
            ))}
            <div className='flex items-center gap-2 px-4 pt-4 border-t border-border/60'>
              <Button
                variant='outline'
                size='sm'
                className='flex-1 bg-white text-black border-black hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-900'
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href='/sign-in'>Sign In</Link>
              </Button>
              <Button
                size='sm'
                className='flex-1 bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href='/sign-up'>Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
