"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Brain } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-foreground">RevivalMed</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#fonctionnalites" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Fonctionnalites
          </Link>
          <Link href="#comment-ca-marche" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Comment ca marche
          </Link>
          <Link href="#temoignages" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Temoignages
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button size="sm" asChild>
            <a href="#waitlist">Rejoindre la liste</a>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-4 px-4 py-6">
            <Link href="#fonctionnalites" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Fonctionnalites
            </Link>
            <Link href="#comment-ca-marche" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Comment ca marche
            </Link>
            <Link href="#temoignages" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Temoignages
            </Link>
            <div className="pt-4">
              <Button size="sm" className="w-full" asChild>
                <a href="#waitlist">Rejoindre la liste</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
