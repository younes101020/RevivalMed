import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/confidentialite")({
	component: ConfidentialitePage,
});

function ConfidentialitePage() {
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
						Politique de confidentialité
					</h1>
					<div className="mt-12 space-y-10 text-sm leading-7 text-slate-600">
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Responsable du traitement
							</h2>
							<p className="mt-3">
								Fakallah Younès, micro-entrepreneur, est responsable des
								traitements de données réalisés via RevivalMed. Pour toute
								question ou pour exercer vos droits :{" "}
								<a
									href="mailto:contact@younesfakallah.com"
									className="font-semibold text-[#123d35] underline underline-offset-4"
								>
									contact@younesfakallah.com
								</a>
								.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Données traitées et finalités
							</h2>
							<p className="mt-3">
								RevivalMed traite les données nécessaires à la gestion des
								comptes (nom, adresse e-mail, rôle), à la sécurité des
								connexions (session, adresse IP et agent utilisateur) et au
								fonctionnement de l&apos;accompagnement : parcours, objectifs,
								exercices, progrès, missions et observations. Elles servent à
								fournir le service, permettre le suivi par le thérapeute,
								sécuriser l&apos;accès et répondre aux demandes
								d&apos;assistance.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Base légale et accès aux données
							</h2>
							<p className="mt-3">
								Les traitements nécessaires au fonctionnement du compte et du
								service reposent sur l&apos;exécution du service demandé. Les
								mesures de sécurité reposent sur l&apos;intérêt légitime de
								protéger l&apos;application et ses utilisateurs. Les données
								sont accessibles uniquement à l&apos;éditeur et aux utilisateurs
								autorisés dans le cadre de leur accompagnement, notamment le
								thérapeute et le patient concernés.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Durée de conservation
							</h2>
							<p className="mt-3">
								Les données sont conservées pendant la durée d&apos;utilisation
								du compte. Lorsqu&apos;un compte est supprimé, les données qui y
								sont associées sont supprimées immédiatement, sous réserve des
								obligations légales de conservation applicables.
							</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Vos droits
							</h2>
							<p className="mt-3">
								Vous pouvez demander l&apos;accès, la rectification,
								l&apos;effacement, la limitation ou la portabilité de vos
								données, ainsi que vous opposer à certains traitements, en
								écrivant à l&apos;adresse de contact ci-dessus. Vous pouvez
								également introduire une réclamation auprès de la CNIL.
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
						<Link to="/cookies" className="hover:text-white">
							Cookies
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
