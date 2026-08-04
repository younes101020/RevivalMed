import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
	component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
	return (
		<div className="min-h-screen bg-[#f7f8f2] text-[#123d35]">
			<header className="border-b border-emerald-950/10 bg-[#062b25] px-6 py-5 text-white lg:px-8">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<Link to="/" className="font-semibold tracking-tight">
						RevivalMed
					</Link>
					<Link
						to="/"
						className="text-sm text-emerald-50/75 transition-colors hover:text-white"
					>
						Retour à l&apos;accueil
					</Link>
				</div>
			</header>

			<main className="px-6 py-16 lg:px-8 lg:py-24">
				<div className="mx-auto max-w-3xl">
					<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
						Mentions légales
					</h1>
					<p className="mt-4 text-slate-600">
						Informations relatives à l&apos;édition et à l&apos;hébergement du
						site RevivalMed.
					</p>

					<div className="mt-12 space-y-10 text-sm leading-7 text-slate-600">
						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Éditeur du site
							</h2>
							<p className="mt-3">
								Le site RevivalMed est édité par{" "}
								<strong className="text-[#123d35]">Fakallah Younès</strong>,
								micro-entrepreneur, immatriculé sous le numéro SIRET{" "}
								<strong className="text-[#123d35]">934 751 744 00012</strong>,
								dont l&apos;adresse est située au 25 rue Émile Zola, 60600
								Clermont.
							</p>
							<p className="mt-3">
								Directeur ou directrice de la publication :{" "}
								<strong className="text-[#123d35]">Fakallah Younès</strong>.
								<br />
								Contact :{" "}
								<a
									href="mailto:contact@younesfakallah.com"
									className="font-semibold text-[#123d35] underline underline-offset-4"
								>
									contact@younesfakallah.com
								</a>
								{" · "}
								<a
									href="tel:+33760400930"
									className="font-semibold text-[#123d35] underline underline-offset-4"
								>
									+33 7 60 40 09 30
								</a>
								.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Hébergement
							</h2>
							<p className="mt-3">
								Le site est auto-hébergé par Fakallah Younès sur un serveur
								personnel (Raspberry Pi 5), situé au 25 rue Émile Zola, 60600
								Clermont.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-[#123d35]">
								Propriété intellectuelle
							</h2>
							<p className="mt-3">
								L&apos;ensemble des contenus présents sur ce site, notamment les
								textes, visuels, logos et éléments graphiques, est protégé par
								le droit de la propriété intellectuelle. Toute reproduction,
								représentation ou utilisation, totale ou partielle, sans
								autorisation préalable de l&apos;éditeur est interdite.
							</p>
						</section>
					</div>
				</div>
			</main>

			<footer className="bg-[#062b25] px-6 py-8 text-sm text-emerald-50/60 lg:px-8">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<span>© {new Date().getFullYear()} RevivalMed</span>
					<Link to="/" className="transition-colors hover:text-white">
						Accueil
					</Link>
				</div>
			</footer>
		</div>
	);
}
