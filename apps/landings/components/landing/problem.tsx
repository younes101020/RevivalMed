import { XCircle, CheckCircle } from "lucide-react"

export function Problem() {
  return (
    <section className="border-y border-border bg-card px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Les applications actuelles ne suffisent pas
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            La remediation cognitive ne se resume pas a des exercices isoles. 
            Elle necessite un programme structure et un transfert dans la vie reelle.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Before - Current solutions */}
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Les applications classiques</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Exercices generiques, non personnalises",
                "Aucune structure de programme therapeutique",
                "Pas de lien avec la vie quotidienne",
                "Suivi des progres limite et superficiel",
                "Pas de missions de transfert ecologique",
                "Therapeute hors de la boucle",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive/70" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After - RevivalMed */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Avec RevivalMed</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Programmes 100% personnalises par le therapeute",
                "16 semaines structurees (protocoles RECOS/CRT)",
                "Missions hebdomadaires de transfert ecologique",
                "Tableau de bord complet pour le suivi",
                "Lien direct entre exercices et vie reelle",
                "Le therapeute garde le controle total",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
