import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const themes = [
	{ name: "Détente (par défaut)", color: "#78c9a5" },
	{ name: "Aube citronnée", color: "#f2c14e" },
	{ name: "Forêt tranquille", color: "#4f8f72" },
	{ name: "Océan profond", color: "#4f86c6" },
	{ name: "Corail joyeux", color: "#e98272" },
	{ name: "Lavande solaire", color: "#9b8acb" },
	{ name: "Sable doux", color: "#c99b6b" },
] as const;

export function CustomizationForm() {
	const [selectedTheme, setSelectedTheme] = useState(themes[0].name);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personnalisation</CardTitle>
				<CardDescription>
					Choisissez l’ambiance visuelle qui vous accompagne pendant vos séances.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{themes.map((theme) => {
						const isSelected = selectedTheme === theme.name;

						return (
							<button
								key={theme.name}
								type="button"
								aria-pressed={isSelected}
								onClick={() => setSelectedTheme(theme.name)}
								className={cn(
									"flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg border p-4 text-center transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
									isSelected
										? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
										: "border-border bg-background",
								)}
							>
								<span
									aria-hidden="true"
									className="h-12 w-12 rounded-md border border-black/10 shadow-sm"
									style={{ backgroundColor: theme.color }}
								/>
								<span className="text-sm font-medium">{theme.name}</span>
							</button>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}