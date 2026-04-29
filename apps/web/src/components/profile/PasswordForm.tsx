"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

interface PasswordFormProps {
	onSuccess?: () => void;
}

export function PasswordForm({ onSuccess }: PasswordFormProps) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [pending, setPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		// Validate
		const validation = changePasswordSchema.safeParse({
			currentPassword,
			newPassword,
			confirmPassword,
		});

		if (!validation.success) {
			setError(validation.error.errors[0]?.message ?? "Validation error");
			return;
		}

		setPending(true);
		try {
			const response = await fetch("/api/auth/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword,
					newPassword,
					confirmPassword,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "Failed to change password");
				return;
			}

			setSuccess(true);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			onSuccess?.();
		} catch (err) {
			setError("An error occurred. Please try again.");
			console.error(err);
		} finally {
			setPending(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
				<CardDescription>Update your password</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1">
						<Label htmlFor="currentPassword">Current Password</Label>
						<Input
							id="currentPassword"
							type="password"
							autoComplete="current-password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							disabled={pending}
							required
						/>
					</div>

					<div className="space-y-1">
						<Label htmlFor="newPassword">New Password</Label>
						<Input
							id="newPassword"
							type="password"
							autoComplete="new-password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							disabled={pending}
							required
						/>
						<p className="text-xs text-gray-500">Must be at least 8 characters</p>
					</div>

					<div className="space-y-1">
						<Label htmlFor="confirmPassword">Confirm New Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							autoComplete="new-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={pending}
							required
						/>
					</div>

					{error && <p className="text-sm text-red-500">{error}</p>}
					{success && <p className="text-sm text-green-600">Password changed successfully!</p>}

					<Button type="submit" disabled={pending} className="w-full">
						{pending ? "Changing..." : "Change Password"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
