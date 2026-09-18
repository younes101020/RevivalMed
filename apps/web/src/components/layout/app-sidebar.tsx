import { useEffect, useState } from "react";
import { useStore } from "@tanstack/react-store";
import { useRouteContext, useNavigate, Link } from "@tanstack/react-router";
import { BookOpen, LogOut, RotateCcw, UserPen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { authClient } from "@/lib/auth-client";
import { getPatientXp } from "@/lib/progress";
import {
  getPatientLevel,
  getPatientTier,
  getXpTowardNextLevel,
} from "@/lib/patient-level";
import { levelStore, setTotalXp } from "@/store/level";
import { useAppTour } from "@/components/tours/AppTourProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { user } = useRouteContext({ from: "/_auth" });
  const navigate = useNavigate();
  const { restartTour } = useAppTour();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.image ?? null);
  const totalXp = useStore(levelStore, (state) => state.totalXp);
  const level = getPatientLevel(totalXp);
  const tier = getPatientTier(level);
  const xpTowardNextLevel = getXpTowardNextLevel(totalXp);

  useEffect(() => {
    if (user?.role !== "patient") return;
    getPatientXp({ data: user.id }).then(setTotalXp).catch(() => {
      // The sidebar remains usable when progress cannot be loaded.
    });
  }, [user?.id, user?.role]);

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-0 px-2 py-2">
            <span className="font-semibold text-lg">RevivalMed</span>
            <span className="text-[0.55rem]">outil de remediation cognitive</span>
          </div>
          {user &&
            <Badge
              variant={user.role === "therapist" ? "default" : "secondary"}
              className="text-secondary-foreground h-fit"
            >
              {user.role === "therapist" ? "Thérapeute" : "Patient"}
            </Badge>
          }
        </div>
      </SidebarHeader>
      <SidebarContent data-tour={user?.role === "therapist" ? "therapist-navigation" : "patient-navigation"}>
        <SidebarGroup>
          <SidebarGroupContent>
            {user?.role === "therapist" && (
              <>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/therapist">
                        <Users />
                        <span>Patients</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/programmes" data-tour="therapist-programmes-link">
                        <BookOpen />
                        <span>Programmes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </>
            )}
            {user?.role === "patient" && (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/patient" data-tour="patient-parcours-link">
                      <BookOpen />
                      <span>Parcours</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
            {user?.role === "patient" && (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/patient/missions" data-tour="patient-missions-link">
                      <BookOpen />
                      <span>Mes missions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/profile" data-tour="profile-link">
                      <UserPen />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarMenu>
                <SidebarMenuItem>
                <SidebarMenuButton size="sm" onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-1" />
                Déconnexion
              </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-3 px-2 py-2">
              {user && (
                <div className="flex gap-4" data-tour={user.role === "patient" ? "patient-progress" : undefined}>
                  <div className="w-fit flex items-center">
                    <AvatarUpload
                      src={avatarUrl}
                      name={user.name}
                      size="sm"
                      onUploaded={setAvatarUrl}
                    />
                  </div>
                  <div className="flex gap-1 flex-col items-start min-w-0 flex-1">
                    {user.role === "patient" && (
                      <div className="w-full space-y-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={tier.iconSrc}
                            alt=""
                            width={20}
                            height={20}
                            className="size-5 shrink-0 object-contain"
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {tier.name}
                          </span>
                        </div>
                        <span className="text-xs font-medium">Niveau {level}</span>
                        <div
                          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                          role="progressbar"
                          aria-label={`Niveau ${level}`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={xpTowardNextLevel}
                        >
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${xpTowardNextLevel}%` }}
                          />
                        </div>
                        <span className="text-[0.65rem] text-muted-foreground">{xpTowardNextLevel} / 100 XP</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" onClick={restartTour} className="cursor-pointer" data-tour="restart-tour">
              <RotateCcw className="h-4 w-4 mr-1" />
              Revoir la visite guidée
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
