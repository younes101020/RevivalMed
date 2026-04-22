import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface AvatarUploadProps {
	src?: string | null;
	name: string;
	size?: "sm" | "md" | "lg";
	onUploaded?: (url: string) => void;
}

export function AvatarUpload({ src, name, size = "md", onUploaded }: AvatarUploadProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Optimistic preview before upload completes
		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);
		setUploading(true);

		try {
			const formData = new FormData();
			formData.append("avatar", file);
			const res = await fetch("/api/upload-avatar", {
				method: "POST",
				body: formData,
			});
			if (res.ok) {
				const { url } = (await res.json()) as { url: string };
				onUploaded?.(url);
			}
		} finally {
			setUploading(false);
			// Reset so the same file can be re-selected
			if (inputRef.current) inputRef.current.value = "";
		}
	};

	return (
		<div
			className="relative cursor-pointer group"
			onClick={() => inputRef.current?.click()}
			title="Modifier la photo de profil"
		>
			<Avatar src={preview ?? src} name={name} size={size} />

			{uploading ? (
				<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
					<Loader2 className="h-4 w-4 animate-spin text-white" />
				</div>
			) : (
				<div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
					<Camera className="h-3 w-3 text-white" />
				</div>
			)}

			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				className="hidden"
				onChange={handleFileChange}
				aria-label="Choisir une photo de profil"
			/>
		</div>
	);
}
