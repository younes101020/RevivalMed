import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  mission: any;
  onComplete: () => Promise<void> | void;
};

export default function MissionItem({ mission, onComplete }: Props) {
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(!!mission.completedAt);

  const handleClick = async () => {
    if (completed) return;
    setCompleting(true);
    try {
      await onComplete();
      setCompleted(true);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-semibold">{mission.title}</span>
          {completed ? (
            <Badge variant="secondary" className="text-green-600">
              Terminée ✓
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Non terminée
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mission.description && <p className="text-sm text-muted-foreground">{mission.description}</p>}
        {mission.cognitiveFunctions && mission.cognitiveFunctions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mission.cognitiveFunctions.map((fn: string) => (
              <Badge key={fn} variant="outline" className="text-xs">
                {fn}
              </Badge>
            ))}
          </div>
        )}
        {!completed && (
          <div className="pt-2">
            <Button size="sm" disabled={completing} onClick={handleClick}>
              {completing ? "En cours…" : "Marquer comme terminée"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
