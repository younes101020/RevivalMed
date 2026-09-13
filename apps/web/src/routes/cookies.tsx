import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({ component: CookiesPage });

function CookiesPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b border-border bg-primary px-6 py-5 text-primary-foreground lg:px-8">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<Link to="/" className="font-semibold tracking-tight">
						RevivalMed
					</Link>
					<Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
						Retour à l&apos;accueil
					</Link>
				</div>
			</header>
			<main className="px-6 py-16 lg:px-8 lg:py-24">
				<div className="mx-auto max-w-3xl">
					<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
						Politique relative aux cookies
					</h1>
					<div className="mt-12 space-y-10 text-sm leading-7 text-muted-foreground">
						<section>
							<h2 className="text-xl font-semibold text-foreground">
								Cookies utilisés
							</h2>
							<p className="mt-3">
								RevivalMed utilise uniquement des cookies nécessaires à son
								fonctionnement. Aucun cookie publicitaire ou de mesure
								d&apos;audience n&apos;est utilisé.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-foreground">
								Session de connexion
							</h2>
							<p className="mt-3">
								Un cookie de session permet de maintenir votre connexion
								sécurisée à votre compte. Il est indispensable au fonctionnement
								de l&apos;espace authentifié.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-foreground">
								Préférence d&apos;interface
							</h2>
							<p className="mt-3">
								Le cookie{" "}
								<code className="rounded bg-background px-1 py-0.5 text-foreground">
									sidebar_state
								</code>{" "}
								mémorise l&apos;ouverture ou la fermeture de la barre latérale
								pendant 7 jours. Il améliore l&apos;affichage de
								l&apos;application et ne sert pas à vous suivre.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-foreground">
								Gestion des cookies
							</h2>
							<p className="mt-3">
								Vous pouvez supprimer ou bloquer les cookies depuis les
								paramètres de votre navigateur. Le blocage des cookies
								nécessaires peut empêcher la connexion ou certaines fonctions de
								fonctionner correctement.
							</p>
						</section>
					</div>
				</div>
			</main>
			<footer className="bg-primary px-6 py-8 text-sm text-primary-foreground/80 lg:px-8">
				<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
					<span>© {new Date().getFullYear()} RevivalMed</span>
					<div className="flex gap-5">
						<Link to="/mentions-legales" className="hover:text-primary-foreground">
							Mentions légales
						</Link>
						<Link to="/confidentialite" className="hover:text-primary-foreground">
							Confidentialité
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
