"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const updateProfileSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof updateProfileSchema>;

interface ProfileFormProps {
	initialName: string;
	initialEmail: string;
	onSuccess?: (user: { name: string; email: string }) => void;
}

export function ProfileForm({ initialName, initialEmail, onSuccess }: ProfileFormProps) {
	const [name, setName] = useState(initialName);
	const [email, setEmail] = useState(initialEmail);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [pending, setPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		// Validate
		const validation = updateProfileSchema.safeParse({ name, email });
		if (!validation.success) {
			setError(validation.error.errors[0]?.message ?? "Validation error");
			return;
		}

		// Check if anything changed
		if (name === initialName && email === initialEmail) {
			setError("No changes to save");
			return;
		}

		setPending(true);
		try {
			const response = await fetch("/api/profile/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(
					name !== initialName && email !== initialEmail
						? { name, email }
						: name !== initialName
							? { name }
							: { email },
				),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "Failed to update profile");
				return;
			}

			setSuccess(true);
			onSuccess?.(data.user);
			// Reset to new values
			if (data.user) {
				// Updates will be reflected in the parent component
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
			console.error(err);
		} finally {
			setPending(false);
		}
	};

	const hasChanges = name !== initialName || email !== initialEmail;

	return (
		<Card>
			<CardHeader>
				<CardTitle>General Information</CardTitle>
				<CardDescription>Update your name and email address</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={pending}
							required
						/>
					</div>

					<div className="space-y-1">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={pending}
							required
						/>
					</div>

					{error && <p className="text-sm text-red-500">{error}</p>}
					{success && <p className="text-sm text-green-600">Profile updated successfully!</p>}

					<Button type="submit" disabled={!hasChanges || pending} className="w-full">
						{pending ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
