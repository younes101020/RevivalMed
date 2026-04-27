import { 
  CalendarDays, 
  Target, 
  BarChart3, 
  Users, 
  Puzzle, 
  RefreshCw 
} from "lucide-react"

const features = [
  {
    icon: CalendarDays,
    title: "Programmes de 16 semaines",
    description:
      "Creez des programmes structures suivant les protocoles valides RECOS et CRT. Chaque semaine combine exercices cognitifs et mission ecologique.",
  },
  {
    icon: Puzzle,
    title: "Exercices cognitifs cibles",
    description:
      "Bibliotheque complete d'exercices couvrant memoire, attention, fonctions executives, cognition sociale. Adaptez la difficulte a chaque patient.",
  },
  {
    icon: Target,
    title: "Missions ecologiques",
    description:
      "Une mission par semaine pour garantir le transfert dans la vie quotidienne. Liste de courses, organisation d'agenda, gestion de budget...",
  },
  {
    icon: Users,
    title: "Suivi patient integre",
    description:
      "Visualisez les progres de chaque patient en temps reel. Recevez des notifications et ajustez le programme en fonction des resultats.",
  },
  {
    icon: BarChart3,
    title: "Analytics avances",
    description:
      "Tableaux de bord detailles pour suivre l'evolution cognitive, le taux de completion des missions et l'engagement du patient.",
  },
  {
    icon: RefreshCw,
    title: "Flexibilite totale",
    description:
      "Modifiez le programme a tout moment. Ajoutez, supprimez ou reordonnez les exercices et missions selon les besoins du patient.",
  },
]

export function Features() {
  return (
    <section id="fonctionnalites" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Fonctionnalites
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tout ce dont vous avez besoin pour une remediation cognitive <span className="font-medium italic">efficace</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            RevivalMed reunit tous les outils necessaires pour concevoir, suivre et 
            optimiser vos programmes de remediation cognitive.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
