"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Loader2, MessageCircle, Bell, Gift } from "lucide-react"

export function Waitlist() {
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
    <section id="waitlist" className="border-t border-border bg-card px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-primary-foreground">
              <Bell className="h-4 w-4" />
              Lancement prevu juillet 2026
            </div>

            <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              Soyez parmi les premiers a transformer votre pratique
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/90">
              Inscrivez-vous pour etre informe du lancement de RevivalMed
              et beneficier d&apos;un acces prioritaire avec des avantages exclusifs.
            </p>

            {/* Email signup form */}
            <div className="mx-auto mt-10 max-w-md">
              {status === "success" ? (
                <div className="flex items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/10 p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  <p className="text-primary-foreground">Parfait ! Vous serez parmi les premiers informes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email professionnelle"
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    required
                  />
                  <Button
                    size="lg"
                    type="submit"
                    disabled={status === "loading"}
                    variant="secondary"
                    className="gap-2 rounded-xl bg-white text-primary hover:bg-white/90"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        M&apos;inscrire
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Benefits */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Gift className="h-4 w-4" />
                <span>Tarif de lancement exclusif</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <MessageCircle className="h-4 w-4" />
                <span>Acces beta prioritaire</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Donnees hebergees en France</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Conforme RGPD</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Base sur RECOS et CRT</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Support francais</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
