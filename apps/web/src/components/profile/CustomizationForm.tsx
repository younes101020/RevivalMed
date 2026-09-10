import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStore } from "@tanstack/react-store";
import { applyTheme, themeStore, themes } from "@/store/theme";

export function CustomizationForm() {
	const selectedThemeName = useStore(themeStore, (state) => state.name);

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
						const isSelected = selectedThemeName === theme.name;

						return (
							<button
								key={theme.name}
								type="button"
								aria-pressed={isSelected}
								onClick={() => applyTheme(theme.name)}
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
									style={{ backgroundColor: theme.primary }}
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