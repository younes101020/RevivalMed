import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    content:
      "RevivalMed va transformer ma pratique. Je pourrai enfin proposer de vrais programmes de remediation structures sans passer des heures a creer du materiel. Les missions ecologiques sont exactement ce qui manquait.",
    author: "Dr. Sophie Martin",
    role: "Neuropsychologue",
    location: "Paris",
    rating: 5,
  },
  {
    content:
      "En 15 ans de pratique en psychiatrie, c'est le premier outil qui comprend vraiment ce qu'est la remediation cognitive. Le transfert ecologique etait mon point faible, RevivalMed va changer la donne.",
    author: "Dr. Marc Dubois",
    role: "Psychiatre",
    location: "Lyon",
    rating: 5,
  },
  {
    content:
      "L'approche structuree de 16 semaines basee sur RECOS et CRT est exactement ce dont nous avons besoin. J'attends le lancement avec impatience pour mes patients.",
    author: "Marie Lefevre",
    role: "Orthophoniste",
    location: "Bordeaux",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="temoignages" className="border-y border-border bg-card px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Temoignages
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ce que disent les <span className="font-medium italic">therapeutes</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Decouvrez pourquoi les professionnels attendent RevivalMed pour 
            transformer leur pratique de la remediation cognitive.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative flex flex-col rounded-2xl border border-border bg-background p-8"
            >
              {/* Quote icon */}
              <Quote className="absolute -top-3 left-6 h-8 w-8 text-primary/20" />
              
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="flex-1 text-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-serif text-lg font-semibold text-primary">
                  {testimonial.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-serif font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} - {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
