import { createFileRoute, redirect } from "@tanstack/react-router";
import { useOptimistic } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import MissionItem from "@/components/missions/MissionItem";
import { getMissionsForPatient, completeMission } from "@/lib/missions";

export const Route = createFileRoute("/_auth/patient/missions")({
  beforeLoad: ({ context }) => {
    if (context.user?.role !== "patient") {
      throw redirect({ to: "/therapist" });
    }
  },
  loader: async ({ context }) => {
    const data = await getMissionsForPatient({ data: context.user!.id });
    return data;
  },
  ssr: false,
  component: MissionsPage,
});

function MissionsPage() {
  console.log("MissionsPage rendered");
  const { missions, unlocked } = Route.useLoaderData();
  const { user } = Route.useRouteContext();

  const [localMissions, setLocalMissions] = useOptimistic(
    missions ?? [],
    (state: any[], action: { type: string; id?: string; payload?: any[] }) => {
      switch (action.type) {
        case "complete":
          return state.map((m) => (m.id === action.id ? { ...m, completedAt: new Date().toISOString() } : m));
        case "set":
          return action.payload ?? [];
        default:
          return state;
      }
    },
  );

  const handleComplete = async (missionId: string) => {
    // Optimistic UI update via useOptimistic reducer
    setLocalMissions({ type: 'complete', id: missionId } as any);
    try {
      await completeMission({ data: { missionId, patientId: user!.id } });
    } catch (e) {
      // rollback: refetch missions
      const refreshed = await getMissionsForPatient({ data: user!.id });
      setLocalMissions({ type: "set", payload: refreshed.missions ?? [] });
      throw e;
    }
  };

  if (!unlocked) {
    return (
      <section className="h-full container mx-auto p-4 flex items-center justify-center">
        <Card>
          <CardContent className="py-8 flex flex-col items-center gap-2 text-center">
            <span className="text-2xl">🔒</span>
            <p className="font-semibold">Missions verrouillées</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Terminez tous les exercices assignés au niveau maximum pour débloquer les missions.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="h-full container mx-auto p-4">
      <div className="mb-4 text-center">
        <Badge variant="outline" className="text-sm px-3 py-1">
          Mes missions
        </Badge>
      </div>
      <ScrollArea className="space-y-3">
        {localMissions.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">Aucune mission pour le moment.</CardContent>
          </Card>
        ) : (
          localMissions.map((m: any) => (
            <MissionItem key={m.id} mission={m} onComplete={() => handleComplete(m.id)} />
          ))
        )}
      </ScrollArea>
    </section>
  );
}


