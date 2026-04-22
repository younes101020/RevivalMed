import { cn } from "@/lib/utils";

interface AvatarProps {
	src?: string | null;
	name: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const SIZE_CLASSES = {
	sm: "h-8 w-8 text-xs",
	md: "h-10 w-10 text-sm",
	lg: "h-16 w-16 text-xl",
};

function getInitials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? "")
		.join("");
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
	const sizeClass = SIZE_CLASSES[size];

	if (src) {
		return (
			<img
				src={src}
				alt={name}
				className={cn("rounded-full object-cover shrink-0", sizeClass, className)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"rounded-full bg-primary flex items-center justify-center font-medium text-primary-foreground shrink-0 select-none",
				sizeClass,
				className,
			)}
		>
			{getInitials(name)}
		</div>
	);
}
