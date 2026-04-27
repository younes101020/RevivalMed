import { UserPlus, Sliders, Send, LineChart } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Creez le profil patient",
    description:
      "Evaluez les besoins cognitifs de votre patient et definissez les objectifs therapeutiques a atteindre sur 16 semaines.",
  },
  {
    icon: Sliders,
    step: "02",
    title: "Concevez le programme",
    description:
      "Selectionnez les exercices cognitifs adaptes et creez une mission ecologique par semaine pour favoriser le transfert.",
  },
  {
    icon: Send,
    step: "03",
    title: "Lancez la therapie",
    description:
      "Le patient recoit son programme personnalise et peut commencer les exercices et missions depuis son espace dedie.",
  },
  {
    icon: LineChart,
    step: "04",
    title: "Suivez et ajustez",
    description:
      "Analysez les progres en temps reel, adaptez la difficulte et celebrez les reussites avec votre patient.",
  },
]

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="border-y border-border bg-card px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Comment ca marche
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            De l&apos;evaluation aux resultats en <span className="font-medium italic">4 etapes</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Un processus simple et structure pour mettre en place une remediation
            cognitive efficace avec vos patients.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection line - desktop */}
          <div className="absolute left-0 right-0 top-20 hidden h-0.5 bg-border lg:block">
            <div className="absolute inset-y-0 left-0 w-1/4 bg-primary" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Step number with icon */}
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary bg-background shadow-lg">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-serif text-xs font-bold text-primary-foreground">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
