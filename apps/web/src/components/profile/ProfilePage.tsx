"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
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

	useEffect(() => {
		setLocalUser(user);
		setProfilePictureUrl(user.image);
	}, [user]);

	const handleProfileUpdate = (updatedUser: { name?: string; email?: string }) => {
		const newUser = { ...localUser, ...updatedUser };
		setLocalUser(newUser);
		onUserUpdate?.(newUser);
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
		<div className="container max-w-2xl p-8">
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
		</div>
	);
}
