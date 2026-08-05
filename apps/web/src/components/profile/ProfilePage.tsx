"use client";

import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { PasswordForm } from "./PasswordForm";
import { ProfileForm } from "./ProfileForm";
import { ProfilePictureSection } from "./ProfilePictureSection";

interface SessionUser {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	emailVerified: boolean;
	role: "therapist" | "patient";
	createdAt: Date;
	updatedAt: Date;
}

interface ProfilePageProps {
	user: SessionUser;
	onUserUpdate?: (user: Partial<SessionUser>) => void;
}

export function ProfilePage({ user, onUserUpdate }: ProfilePageProps) {
	const [localUser, setLocalUser] = useState(user);
	const [profilePictureUrl, setProfilePictureUrl] = useState(user.image);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setLocalUser(user);
		setProfilePictureUrl(user.image);
	}, [user]);

	const handleProfileUpdate = (updatedUser: {
		name?: string;
		email?: string;
	}) => {
		const newUser = { ...localUser, ...updatedUser };
		setLocalUser(newUser);
		onUserUpdate?.(newUser);
	};

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
		);

		if (!confirmed) return;

		setDeleting(true);
		setDeleteError(null);

		try {
			const response = await fetch("/api/profile/delete", {
				method: "DELETE",
			});

			const data = await response.json();

			if (!response.ok) {
				setDeleteError(data.error ?? "Impossible de supprimer le compte.");
				return;
			}

			await authClient.signOut();
			router.navigate({ to: "/login" });
		} catch (error) {
			console.error(error);
			setDeleteError(
				"Une erreur est survenue lors de la suppression du compte.",
			);
		} finally {
			setDeleting(false);
		}
	};

	const handleProfilePictureUploaded = (url: string) => {
		setProfilePictureUrl(url);
		const newUser = { ...localUser, image: url };
		setLocalUser(newUser);
		onUserUpdate?.(newUser);
	};

	const handleProfilePictureRemoved = () => {
		setProfilePictureUrl(null);
		const newUser = { ...localUser, image: null };
		setLocalUser(newUser);
		onUserUpdate?.(newUser);
	};

	return (
		<div className="h-full container mx-auto p-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Profile</h1>
				<p className="text-gray-500 mt-2">Gérer vos paramètres de compte</p>
			</div>

			<Tabs defaultValue="general" className="space-y-6">
				<TabsList>
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="security">Sécurité</TabsTrigger>
				</TabsList>

				<TabsContent value="general" className="space-y-6">
					<ProfilePictureSection
						src={profilePictureUrl}
						name={localUser.name}
						onUploaded={handleProfilePictureUploaded}
						onRemoved={handleProfilePictureRemoved}
					/>

					<ProfileForm
						initialName={localUser.name}
						initialEmail={localUser.email}
						onSuccess={handleProfileUpdate}
					/>
				</TabsContent>

				<TabsContent value="security" className="space-y-6">
					<PasswordForm />
				</TabsContent>
			</Tabs>

			<div className="mt-8 rounded-xl border border-primary-200/60 bg-primary-50 p-6">
				<div className="flex flex-col gap-4">
					<div>
						<h2 className="text-xl font-semibold text-primary-900">
							Supprimer le compte
						</h2>
						<p className="text-sm text-primary-700/80">
							Cette action est irréversible. Toutes vos données seront
							définitivement supprimées.
						</p>
					</div>
					{deleteError && <p className="text-sm text-primary-600">{deleteError}</p>}
					<Button
						variant="destructive"
						size="default"
						onClick={handleDeleteAccount}
						disabled={deleting}
					>
						{deleting ? "Suppression..." : "Supprimer mon compte"}
					</Button>
				</div>
			</div>
		</div>
	);
}
