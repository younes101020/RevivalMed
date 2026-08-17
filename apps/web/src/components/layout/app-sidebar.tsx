import { useEffect, useState } from "react";
import { useStore } from "@tanstack/react-store";
import { useRouteContext, useNavigate, Link } from "@tanstack/react-router";
import { LogOut, Users, BookOpen, UserPen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { authClient } from "@/lib/auth-client";
import { getPatientXp } from "@/lib/progress";
import {
  getPatientLevel,
  getPatientTier,
  getXpTowardNextLevel,
} from "@/lib/patient-level";
import { levelStore, setTotalXp } from "@/store/level";
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
        <div className="flex flex-col gap-0 px-2 py-2">
          <span className="font-semibold text-lg">RevivalMed</span>
          <span className="text-[0.55rem]">outil de remediation cognitive</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
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
                      <Link to="/programmes">
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
                    <Link to="/patient">
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
                    <Link to="/patient/missions">
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
                    <Link to="/profile">
                      <UserPen />
                      <span>Profile</span>
                    </Link>
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
                <div className="flex gap-4">
                  <div className="w-fit flex items-center">
                    <AvatarUpload
                      src={avatarUrl}
                      name={user.name}
                      size="sm"
                      onUploaded={setAvatarUrl}
                    />
                  </div>
                  <div className="flex gap-1 flex-col items-start min-w-0 flex-1">
                    <span className="text-sm text-muted-foreground">{user.name}</span>
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
                    <Badge
                      variant={user.role === "therapist" ? "default" : "secondary"}
                      className="text-secondary-foreground"
                    >
                      {user.role === "therapist" ? "Thérapeute" : "Patient"}
                    </Badge>
                  </div>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Déconnexion
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
