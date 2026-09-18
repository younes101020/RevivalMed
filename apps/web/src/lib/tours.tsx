import type { StepType } from "@reactour/tour";
import { Link } from "@tanstack/react-router";

export type TourRole = "patient" | "therapist";

export const TOUR_STORAGE_KEYS: Record<TourRole, string> = {
	patient: "revivalmed-tour-patient-seen",
	therapist: "revivalmed-tour-therapist-seen",
};

type TourStep = StepType & { route?: string; exact?: boolean };

const sharedSteps: Record<TourRole, TourStep[]> = {
	patient: [
		{
			selector: '[data-tour="patient-navigation"]',
			content: "Depuis cette navigation, retrouvez votre parcours, vos missions et votre profil.",
		},
		{
			selector: '[data-tour="patient-progress"]',
			content: "Votre niveau et vos XP suivent votre progression dans les exercices.",
		},
		{
			selector: '[data-tour="patient-parcours-link"]',
			content: "Ouvrez votre parcours pour retrouver les exercices qui vous sont attribués.",
		},
		{
			selector: '[data-tour="patient-exercises"]',
			content: "Les onglets regroupent les exercices qui vous sont assignés cette semaine.",
			route: "/patient",
			exact: true,
		},
		{
			selector: '[data-tour="patient-mission"]',
			content: "La mission applique vos acquis dans une situation de la vie quotidienne.",
			route: "/patient",
			exact: true,
		},
		{
			selector: '[data-tour="patient-missions-link"]',
			content: "Retrouvez ici vos missions de la vie quotidienne et leur état d'avancement.",
		},
		{
			selector: '[data-tour="patient-missions"]',
			content: "Chaque mission présente son objectif et vous permet de la marquer comme terminée.",
			route: "/patient/missions",
		},
		{
			selector: '[data-tour="profile-link"]',
			content: "Votre profil rassemble vos informations personnelles et vos préférences.",
		},
		{
			selector: '[data-tour="profile-settings"]',
			content: "Gérez ici vos informations, votre sécurité et vos préférences de jeu.",
			route: "/profile",
		},
	],
	therapist: [
		{
			selector: '[data-tour="therapist-navigation"]',
			content: "Accédez rapidement à vos patients, vos programmes et votre profil.",
		},
		{
			selector: '[data-tour="therapist-programmes-link"]',
			content: (
				<span>
					Consultez vos programmes ici. <Link to="/programmes">Ouvrir les programmes</Link>
				</span>
			),
			route: "/therapist",
		},
		{
			selector: '[data-tour="therapist-patients"]',
			content: "Cette page rassemble les patients qui vous sont rattachés.",
			route: "/therapist",
		},
		{
			selector: '[data-tour="therapist-view-switcher"]',
			content: "Choisissez une présentation en grille ou en liste selon votre préférence.",
			route: "/therapist",
		},
		{
			selector: '[data-tour="therapist-add-patient"]',
			content: "Ajoutez ici un nouveau patient et créez ses identifiants d'accès.",
			route: "/therapist",
		},
		{
			selector: '[data-tour="therapist-create-program"]',
			content: "Les programmes permettent d'organiser les exercices et les missions d'un patient.",
			route: "/programmes",
		},
	],
};

export function getTourSteps(role: TourRole, pathname: string): StepType[] {
	return sharedSteps[role]
		.filter((step) => {
			if (!step.route) return true;
			return step.exact
				? pathname === step.route
				: pathname === step.route || pathname.startsWith(`${step.route}/`);
		})
		.map(({ route: _route, exact: _exact, ...step }) => step);
}