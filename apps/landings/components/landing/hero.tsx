"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Target, TrendingUp, CheckCircle2, Loader2 } from "lucide-react"

export function Hero() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus("loading")
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setStatus("success")
    setEmail("")
  }

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - Content */}
          <div className="flex flex-col items-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Bientot disponible
            </div>

            <h1 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Concevez des programmes de{" "}
              <span className="text-primary">remediation cognitive</span>{" "}
              <span className="font-medium italic">personnalises</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Bien plus qu&apos;une simple application d&apos;entrainement cognitif. 
              Base sur les programmes valides <span className="font-serif font-semibold text-foreground">RECOS</span> et <span className="font-serif font-semibold text-foreground">CRT</span>,
              <span className="font-serif font-semibold text-foreground"> RevivalMed</span> vous permet de creer des programmes structures de 16 semaines 
              combinant exercices cognitifs et missions ecologiques pour un transfert reel 
              dans la vie quotidienne de vos patients.
            </p>

            {/* Email signup form */}
            <div className="mt-8 w-full max-w-md">
              {status === "success" ? (
                <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="text-foreground">Merci ! Vous serez informe du lancement.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <Button size="lg" type="submit" disabled={status === "loading"} className="gap-2 rounded-xl">
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Etre informe
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
              <p className="mt-3 text-sm text-muted-foreground">
                Rejoignez les therapeutes qui attendent le lancement. Pas de spam.
              </p>
            </div>
          </div>

          {/* Right column - Visual */}
          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-xl">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-semibold text-card-foreground">Programme de Marie D.</h3>
                  <p className="text-sm text-muted-foreground">Semaine 8 / 16</p>
                </div>
                <div className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
                  En cours
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression globale</span>
                  <span className="font-medium text-foreground">50%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-1/2 rounded-full bg-primary transition-all" />
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <Calendar className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="font-serif text-lg font-bold text-foreground">16</p>
                  <p className="text-xs text-muted-foreground">Semaines</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <Target className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="font-serif text-lg font-bold text-foreground">8</p>
                  <p className="text-xs text-muted-foreground">Missions</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <TrendingUp className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="font-serif text-lg font-bold text-foreground">+32%</p>
                  <p className="text-xs text-muted-foreground">Progres</p>
                </div>
              </div>

              {/* Current tasks */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">
                    <span role="img" aria-label="brain">&#129504;</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">Exercice: Memoire de travail</p>
                    <p className="text-sm text-muted-foreground">3 sessions cette semaine</p>
                  </div>
                  <div className="text-xs text-primary">En cours</div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">
                    <span role="img" aria-label="target">&#127919;</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">Mission: Liste de courses</p>
                    <p className="text-sm text-muted-foreground">Transfert ecologique</p>
                  </div>
                  <div className="text-xs font-medium text-accent-foreground">Cette semaine</div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -left-4 top-1/4 rounded-lg border border-border bg-card p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Mission validee</p>
                  <p className="text-xs text-muted-foreground">il y a 2h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
