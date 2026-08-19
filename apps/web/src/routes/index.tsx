import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useId } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function destinationForRole(role?: string) {
	return role === "therapist" ? "/therapist" : "/patient";
}

function LandingPage() {
	const { user } = useRouteContext({ from: "__root__" });
	const appDestination = destinationForRole(user?.role);
	const howItWorksId = useId();

	return (
		<div className="min-h-screen overflow-hidden bg-[#062b25] text-white">
			<header className="absolute inset-x-0 top-0 z-20">
				<nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
					<Link to="/" className="font-semibold tracking-tight">
						RevivalMed
					</Link>
					<div className="flex items-center gap-3">
						{user ? (
							<>
								<span className="hidden text-sm text-emerald-50/80 sm:block">
									Bonjour, {user.name}
								</span>
								<Button
									asChild
									className="rounded-full bg-white text-[#075143] hover:bg-emerald-50"
								>
									<Link to={appDestination}>Mon espace</Link>
								</Button>
							</>
						) : (
							<Button
								asChild
								className="rounded-full bg-white text-[#075143] hover:bg-emerald-50"
							>
								<Link to="/login">Se connecter</Link>
							</Button>
						)}
					</div>
				</nav>
			</header>

			<main>
				<section className="landing-hero relative isolate flex min-h-[760px] items-center overflow-hidden px-6 pt-28 lg:px-8">
					<div
						className="landing-hero-video absolute inset-0 -z-20"
						aria-hidden="true"
					/>
					<div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062b25] via-[#073b31]/90 to-[#073b31]/35" />
					<div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
						<div className="max-w-2xl">
							<p className="mb-6 flex w-fit items-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-100/10 px-4 py-2 text-sm text-emerald-50 backdrop-blur">
								Le premier outil numérique de remédiation cognitive
							</p>
							<h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
								Structurez des parcours de remédiation cognitive qui se
								prolongent dans la vraie vie.
							</h1>
							<p className="mt-7 max-w-xl text-lg leading-8 text-emerald-50/80 sm:text-xl">
								RevivalMed offre aux thérapeutes un cadre simple pour définir
								les objectifs, proposer un entraînement ciblé et accompagner la
								généralisation des acquis avec des missions de la semaine.
							</p>
							<div className="mt-9 flex flex-wrap gap-4">
								<Button
									asChild
									size="lg"
									className="h-12 rounded-full bg-emerald-300 px-6 text-[#06352c] hover:bg-emerald-200"
								>
									<Link to={user ? appDestination : "/login"}>
										{user ? "Accéder à mon espace" : "Découvrir RevivalMed"}
									</Link>
								</Button>
								<a
									href={`#${howItWorksId}`}
									className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-medium transition hover:bg-white/10"
								>
									Comment ça marche
								</a>
							</div>
						</div>
						<div className="hidden lg:block">
							<div className="ml-auto max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
								<div className="flex items-center justify-between text-sm text-emerald-50/80">
									<span>Parcours du jour</span>
									<span>3 / 4</span>
								</div>
								<div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
									<div className="h-full w-3/4 rounded-full bg-emerald-300" />
								</div>
								<div className="mt-7 rounded-2xl bg-white p-5 text-[#174c42]">
									<p className="text-sm font-medium">Chaque progrès compte.</p>
									<p className="mt-1 text-sm text-slate-500">
										Des exercices adaptés à votre rythme et à vos objectifs.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-[#f7f8f2] px-6 py-24 text-[#123d35] lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[.2em] text-emerald-700">
									Le transfert des acquis dans la vie réelle
								</p>
								<h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
									Des entrainements utiles
								</h2>
							</div>
						</div>
						<img
							src="/images/generalisation.jpg"
							alt="generalisation"
						/>
					</div>
				</section>

				<section className="bg-[#f7f8f2] px-6 py-24 text-[#123d35] lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[.2em] text-emerald-700">
									Du programme à la vie réelle
								</p>
								<h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
									Un cadre concret pour conduire la remédiation cognitive.
								</h2>
							</div>
							<p className="max-w-2xl text-lg leading-8 text-slate-600">
								RevivalMed aide le thérapeute à organiser le parcours complet,
								et le patient à relier ses entraînements à ses situations
								quotidiennes.
							</p>
						</div>
						<div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
							{[
								[
									"1. Construire le parcours",
									"Le thérapeute ajoute son patient, choisit un programme CRT, RECOS ou personnalisé, puis définit un ou plusieurs objectifs de vie.",
								],
								[
									"2. Organiser la progression",
									"Les exercices sont distribués semaine par semaine pour proposer un entraînement ciblé, progressif et cohérent avec les objectifs du programme.",
								],
								[
									"3. Généraliser les acquis",
									"Après ses exercices, le patient débloque une mission à réaliser dans la vie réelle : c’est le lien essentiel entre entraînement et quotidien.",
								],
								[
									"4. Suivre et ajuster",
									"Le thérapeute suit l’avancée des exercices et des missions. Le patient partage ce qui l’a aidé, ses difficultés et ses stratégies pour nourrir l’accompagnement.",
								],
							].map(([title, description]) => (
								<article
									key={title}
									className="rounded-3xl border border-emerald-950/10 bg-white p-7 shadow-sm"
								>
									<h3 className="text-xl font-semibold">{title}</h3>
									<p className="mt-4 leading-7 text-slate-600">{description}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section
					id={howItWorksId}
					className="bg-[#f7f8f2] px-6 py-24 text-[#123d35] lg:px-8"
				>
					<div className="mx-auto max-w-7xl">
						<div className="max-w-2xl">
							<p className="text-sm font-semibold uppercase tracking-[.2em] text-emerald-700">
								Une expérience guidée
							</p>
							<h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
								Un accompagnement qui relie le soin au quotidien.
							</h2>
						</div>
						<div className="mt-14 grid gap-5 md:grid-cols-3">
							{[
								[
									"Des objectifs clairs",
									"Le thérapeute structure un parcours selon les besoins et priorités de chaque patient.",
								],
								[
									"Des exercices adaptés",
									"Mémoire, attention, planification ou langage : chaque séance stimule les bonnes compétences.",
								],
								[
									"Des progrès visibles",
									"Suivez la régularité et l'évolution du parcours pour rester motivé, séance après séance.",
								],
							].map(([title, description]) => {
								return (
									<article
										key={title as string}
										className="rounded-3xl border border-emerald-950/10 bg-white p-7 shadow-sm"
									>
										<h3 className="text-xl font-semibold">{title as string}</h3>
										<p className="mt-3 leading-7 text-slate-600">
											{description as string}
										</p>
									</article>
								);
							})}
						</div>
					</div>
				</section>

				<section className="bg-[#e5f0e6] px-6 py-24 text-[#123d35] lg:px-8">
					<div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
						<div className="rounded-[2rem] bg-[#0b4b3f] p-8 text-white shadow-xl sm:p-11">
							<p className="text-sm font-semibold uppercase tracking-[.2em] text-emerald-200">
								Pensé pour le soin
							</p>
							<h2 className="mt-5 text-4xl font-semibold tracking-tight">
								Un espace partagé, sans perdre l’humain de vue.
							</h2>
							<div className="mt-9 space-y-5">
								{[
									"Une interface accessible pour travailler en autonomie.",
									"Des programmes organisés par le professionnel de santé.",
									"Un suivi qui nourrit l’échange pendant les consultations.",
								].map((item) => (
									<p key={item} className="flex gap-3 text-emerald-50/90">
										{item}
									</p>
								))}
							</div>
						</div>
						<div>
							<p className="text-sm font-semibold uppercase tracking-[.2em] text-emerald-700">
								Pour avancer ensemble
							</p>
							<h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
								Faire de chaque entraînement un pas vers plus d’autonomie.
							</h2>
							<p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
								RevivalMed donne à chacun un cadre rassurant pour pratiquer,
								progresser et échanger avec son thérapeute.
							</p>
							<Button
								asChild
								size="lg"
								className="mt-9 rounded-full text-white"
							>
								<Link to={user ? appDestination : "/login"}>
									{user
										? "Reprendre mon parcours"
										: "Se connecter à RevivalMed"}
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
			<footer className="bg-[#062b25] px-6 py-8 text-sm text-emerald-50/60 lg:px-8">
				<div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<span>© {new Date().getFullYear()} RevivalMed</span>
					<div className="flex flex-wrap items-center gap-x-5 gap-y-2">
						<Link
							to="/mentions-legales"
							className="transition-colors hover:text-white"
						>
							Mentions légales
						</Link>
						<Link
							to="/confidentialite"
							className="transition-colors hover:text-white"
						>
							Confidentialité
						</Link>
						<Link to="/cookies" className="transition-colors hover:text-white">
							Cookies
						</Link>
						<span>Outil numérique de remédiation cognitive</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
