import { Brain, Eye, Lightbulb, Heart } from "lucide-react"

const programs = [
  {
    icon: Brain,
    title: "Memoire",
    modules: ["Memoire de travail", "Memoire episodique", "Memoire prospective"],
    missions: ["Liste de courses", "Rappel de rendez-vous", "Memorisation de trajets"],
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: Eye,
    title: "Attention",
    modules: ["Attention selective", "Attention soutenue", "Attention divisee"],
    missions: ["Lecture active", "Ecoute de podcast", "Double tache quotidienne"],
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: Lightbulb,
    title: "Fonctions executives",
    modules: ["Planification", "Flexibilite mentale", "Inhibition"],
    missions: ["Organisation de la semaine", "Changement de routine", "Gestion du budget"],
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Heart,
    title: "Cognition sociale",
    modules: ["Reconnaissance emotionnelle", "Theorie de l'esprit", "Attribution"],
    missions: ["Analyse de conversation", "Journal emotionnel", "Situation sociale"],
    color: "bg-chart-4/10 text-chart-4",
  },
]

export function Programs() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Modules disponibles
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Des exercices et missions pour chaque <span className="font-medium italic">domaine cognitif</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Bases sur les programmes valides RECOS et CRT, nos modules couvrent 
            l&apos;ensemble des fonctions cognitives ciblees en remediation.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${program.color}`}>
                <program.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-foreground">
                {program.title}
              </h3>
              
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Exercices
                </p>
                <ul className="space-y-1">
                  {program.modules.map((module, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {module}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Missions ecologiques
                </p>
                <ul className="space-y-1">
                  {program.missions.map((mission, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      {mission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
