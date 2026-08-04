import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({ component: CookiesPage });

function CookiesPage() {
	return (
		<div className="min-h-screen bg-[#f7f8f2] text-[#123d35]">
			<header className="border-b border-emerald-950/10 bg-[#062b25] px-6 py-5 text-white lg:px-8">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<Link to="/" className="font-semibold tracking-tight">
						RevivalMed
					</Link>
					<Link to="/" className="text-sm text-emerald-50/75 hover:text-white">
						Retour à l&apos;accueil
					</Link>
				</div>
			</header>
			<main className="px-6 py-16 lg:px-8 lg:py-24">
				<div className="mx-auto max-w-3xl">
					<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
						Politique relative aux cookies
					</h1>
					<div className="mt-12 space-y-10 text-sm leading-7 text-slate-600">
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Cookies utilisés
							</h2>
							<p className="mt-3">
								RevivalMed utilise uniquement des cookies nécessaires à son
								fonctionnement. Aucun cookie publicitaire ou de mesure
								d&apos;audience n&apos;est utilisé.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Session de connexion
							</h2>
							<p className="mt-3">
								Un cookie de session permet de maintenir votre connexion
								sécurisée à votre compte. Il est indispensable au fonctionnement
								de l&apos;espace authentifié.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Préférence d&apos;interface
							</h2>
							<p className="mt-3">
								Le cookie{" "}
								<code className="rounded bg-white px-1 py-0.5 text-[#123d35]">
									sidebar_state
								</code>{" "}
								mémorise l&apos;ouverture ou la fermeture de la barre latérale
								pendant 7 jours. Il améliore l&apos;affichage de
								l&apos;application et ne sert pas à vous suivre.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
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
			<footer className="bg-[#062b25] px-6 py-8 text-sm text-emerald-50/60 lg:px-8">
				<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
					<span>© {new Date().getFullYear()} RevivalMed</span>
					<div className="flex gap-5">
						<Link to="/mentions-legales" className="hover:text-white">
							Mentions légales
						</Link>
						<Link to="/confidentialite" className="hover:text-white">
							Confidentialité
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
