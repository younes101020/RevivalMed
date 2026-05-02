import { useState } from "react";
import { useRouteContext, useNavigate, Link } from "@tanstack/react-router";
import { LogOut, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { authClient } from "@/lib/auth-client";
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/exercices">
                    <Activity />
                    <span>Exercices</span>
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
                  <div className="flex gap-2 flex-col items-start">
                    <span className="text-sm text-muted-foreground">{user.name}</span>
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