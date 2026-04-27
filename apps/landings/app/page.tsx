import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Programs } from "@/components/landing/programs"
import { Testimonials } from "@/components/landing/testimonials"
import { Waitlist } from "@/components/landing/waitlist"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <Programs />
      <Testimonials />
      <Waitlist />
      <Footer />
    </main>
  )
}
