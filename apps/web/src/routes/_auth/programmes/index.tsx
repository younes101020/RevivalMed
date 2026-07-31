import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { CircleHelp, ExternalLink, MapPlus } from "lucide-react";
import { useId, useState } from "react";
import {
	Stepper,
	StepperContent,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperPanel,
	StepperSeparator,
	StepperTrigger,
} from "@/components/layout/stepper";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
	ProgramCreator,
	type ProgramPreset,
} from "@/routes/_auth/therapist/patients/$patientId";

export const Route = createFileRoute("/_auth/programmes/")({
	beforeLoad: ({ context }) => {
		if (context.user?.role !== "therapist") {
			throw redirect({ to: "/patient" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	if (!user) return null;
	return (
		<div className="container mx-auto p-8 space-y-6">
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Mes programmes</h1>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button className="text-secondary-foreground">
								<MapPlus />
								Créer mon programme
							</Button>
						</DialogTrigger>
						<DialogContent className="flex h-[90vh] w-[calc(100vw-2rem)] max-w-6xl flex-col overflow-hidden">
							<DialogHeader>
								<DialogTitle>Nouveau Programme</DialogTitle>
							</DialogHeader>
							<div className="min-h-0 flex-1 rounded-xl bg-card p-4">
								<ProgramPattern
									therapistId={user.id}
									onDone={() => {
										setOpen(false);
										router.invalidate();
									}}
								/>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="text-xl pb-1">RECOS</h2>
					<Separator />
				</div>
				<div>
					<h2 className="text-xl pb-1">CRT</h2>
					<Separator />
				</div>
			</div>
		</div>
	);
}

const steps = [1, 2];

type ProgramType = ProgramPreset;

const programTypes: Array<{
	value: ProgramType;
	title: string;
	description: string;
	tooltip?: {
		description: string;
		href: string;
	};
}> = [
	{
		value: "crt",
		title: "CRT",
		description: "Cognitive Remediation Therapy",
		tooltip: {
			description:
				"La CRT entraîne de façon structurée les fonctions cognitives telles que l’attention, la mémoire et les fonctions exécutives, afin de favoriser leur transfert dans la vie quotidienne.",
			href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6494483/",
		},
	},
	{
		value: "recos",
		title: "RECOS",
		description:
			"Remédiation cognitive pour la cognition dans la schizophrénie",
		tooltip: {
			description:
				"RECOS est un programme individualisé de remédiation cognitive. Il cible les fonctions les plus fragiles, notamment la mémoire, l’attention, le raisonnement et les fonctions exécutives.",
			href: "https://www.chuv.ch/fileadmin/sites/dp/documents/Remediation_cognitive_-_Programme_RECOS.pdf",
		},
	},
	{
		value: "personalized",
		title: "Personnalisé",
		description: "Créez librement les exercices et objectifs du programme.",
	},
];

function ProgramPattern({
	therapistId,
	onDone,
}: {
	therapistId: string;
	onDone: () => void;
}) {
	const [activeStep, setActiveStep] = useState(1);
	const [programType, setProgramType] = useState<ProgramType | null>(null);
	const [programName, setProgramName] = useState("");
	const programNameId = useId();

	return (
		<Stepper
			className="flex h-full min-h-0 w-full flex-col gap-8"
			value={activeStep}
			onValueChange={setActiveStep}
		>
			<StepperNav>
				{steps.map((step) => (
					<StepperItem key={step} step={step}>
						<StepperTrigger>
							<StepperIndicator>{step}</StepperIndicator>
						</StepperTrigger>
						{steps.length > step && (
							<StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
						)}
					</StepperItem>
				))}
			</StepperNav>

			<StepperPanel className="flex min-h-0 flex-1 flex-col text-sm">
				{steps.map((step) => (
					<StepperContent
						key={step}
						value={step}
						className={cn(
							"space-y-5",
							step === 2 && "flex min-h-0 flex-1 flex-col",
						)}
					>
						{step === 1 ? (
							<>
								<div>
									<Label htmlFor={programNameId}>Nom du programme</Label>
									<Input
										id={programNameId}
										className="mt-2"
										placeholder="Ex. Programme mémoire"
										value={programName}
										onChange={(event) => setProgramName(event.target.value)}
									/>
								</div>

								<div>
									<h2 className="font-semibold">
										Choisissez le type de programme
									</h2>
									<p className="mt-1 text-sm text-muted-foreground">
										Ce choix servira à préparer la suite du programme.
									</p>
								</div>

								<TooltipProvider>
									<div className="grid gap-3">
										{programTypes.map((type) => {
											const selected = programType === type.value;

											return (
												<label
													key={type.value}
													className={cn(
														"flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50",
														selected &&
															"border-primary bg-primary/5 ring-1 ring-primary",
													)}
												>
													<input
														type="radio"
														name="program-type"
														value={type.value}
														checked={selected}
														onChange={() => setProgramType(type.value)}
														className="mt-1 size-4 accent-primary"
													/>
													<span className="min-w-0 flex-1">
														<span className="flex items-center gap-2 font-medium">
															{type.title}
															{type.tooltip && (
																<Tooltip>
																	<TooltipTrigger asChild>
																		<button
																			type="button"
																			aria-label={`En savoir plus sur ${type.title}`}
																			className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
																			onClick={(event) =>
																				event.preventDefault()
																			}
																		>
																			<CircleHelp className="size-4" />
																		</button>
																	</TooltipTrigger>
																	<TooltipContent
																		side="right"
																		className="w-72 space-y-2 p-3 text-left leading-relaxed"
																	>
																		<p>{type.tooltip.description}</p>
																		<a
																			href={type.tooltip.href}
																			target="_blank"
																			rel="noreferrer"
																			className="inline-flex items-center gap-1 font-medium underline underline-offset-2 hover:opacity-80"
																		>
																			Voir plus de détails
																			<ExternalLink className="size-3" />
																		</a>
																	</TooltipContent>
																</Tooltip>
															)}
														</span>
														<span className="mt-1 block text-sm text-muted-foreground">
															{type.description}
														</span>
													</span>
												</label>
											);
										})}
									</div>
								</TooltipProvider>

								<div className="flex justify-end">
									<Button
										disabled={!programType || !programName.trim()}
										onClick={() => setActiveStep(2)}
									>
										Continuer
									</Button>
								</div>
							</>
						) : (
							<div className="flex min-h-0 flex-1">
								{programType && (
									<ProgramCreator
										key={`${programType}-${programName}`}
										therapistId={therapistId}
										programName={programName}
										preset={programType}
										scrollableWeeks
										variant="template"
										onDone={onDone}
										onCancel={() => setActiveStep(1)}
									/>
								)}
							</div>
						)}
					</StepperContent>
				))}
			</StepperPanel>
		</Stepper>
	);
}
