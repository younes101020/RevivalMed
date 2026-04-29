"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarUpload } from "@/components/ui/avatar-upload";

interface ProfilePictureSectionProps {
	src?: string | null;
	name: string;
	onUploaded?: (url: string) => void;
	onRemoved?: () => void;
}

export function ProfilePictureSection({ src, name, onUploaded, onRemoved }: ProfilePictureSectionProps) {
	const [isRemoving, setIsRemoving] = useState(false);
	const [removeError, setRemoveError] = useState<string | null>(null);

	const handleRemove = async () => {
		if (!src) return;

		const confirmed = window.confirm("Are you sure you want to remove your profile picture?");
		if (!confirmed) return;

		setIsRemoving(true);
		setRemoveError(null);

		try {
			const response = await fetch("/api/profile/avatar/delete", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();

			if (!response.ok) {
				setRemoveError(data.error ?? "Failed to remove profile picture");
				return;
			}

			onRemoved?.();
		} catch (err) {
			setRemoveError("An error occurred. Please try again.");
			console.error(err);
		} finally {
			setIsRemoving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Picture</CardTitle>
				<CardDescription>Upload or update your profile picture</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<AvatarUpload
					src={src}
					name={name}
					size="lg"
					onUploaded={onUploaded}
				/>

				{src && (
					<div>
						{removeError && <p className="text-sm text-red-500 mb-2">{removeError}</p>}
						<Button
							variant="outline"
							onClick={handleRemove}
							disabled={isRemoving}
							className="w-full"
						>
							{isRemoving ? "Removing..." : "Remove Picture"}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
