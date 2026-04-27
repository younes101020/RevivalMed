import Link from "next/link"
import { Brain } from "lucide-react"

const footerLinks = {
  produit: [
    { label: "Fonctionnalites", href: "#fonctionnalites" },
    { label: "Comment ca marche", href: "#comment-ca-marche" },
    { label: "Temoignages", href: "#temoignages" },
  ],
  ressources: [
    { label: "Programmes RECOS", href: "#" },
    { label: "Programme CRT", href: "#" },
    { label: "Blog", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  legal: [
    { label: "Mentions legales", href: "#" },
    { label: "CGU", href: "#" },
    { label: "Politique de confidentialite", href: "#" },
    { label: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">RevivalMed</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              L&apos;outil de reference pour la remediation cognitive. 
              Concevez, suivez et optimisez vos programmes therapeutiques.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-serif text-sm font-semibold text-foreground">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.produit.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-sm font-semibold text-foreground">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RevivalMed. Tous droits reserves.
          </p>
          <p className="text-sm text-muted-foreground">
            Concu pour les therapeutes en France
          </p>
        </div>
      </div>
    </footer>
  )
}
