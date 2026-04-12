import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Event } from "../types/event";
import { DAYS } from "../const/days";
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, UniqueIdentifier, useDraggable, useDroppable } from '@dnd-kit/core';
import { EVENTS } from "../const/events";
import { Badge } from "@/components/ui/badge";


function Droppable(props: { children: React.ReactNode }) {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };


  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

function Draggable(props: { children: React.ReactNode, id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <Badge ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </Badge>
  );
}

interface EventsDialogProps {
    editingEvent: Event | null;
    selectedSlot: { day: number; time: string } | null;
    formData: {
        title: string;
        description: string;
        startTime: string;
        endTime: string;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            title: string;
            description: string;
            startTime: string;
            endTime: string;
        }>
    >;
    timeSlots: string[];
    handleDelete: () => void;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSave: () => void;
}

export function EventsDialog({
    editingEvent,
    selectedSlot,
    formData,
    setFormData,
    timeSlots,
    handleDelete,
    setIsDialogOpen,
    handleSave
}: EventsDialogProps) {
    const [isDropped, setIsDropped] = useState(false);
	const [draggedIds, setDraggedIds] = useState<UniqueIdentifier[]>([]);
    return (
		<DndContext onDragEnd={handleDragEnd}>
            <DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>
							{editingEvent ? "Modifier l'événement" : "Nouvel événement"}
						</DialogTitle>
						<DialogDescription>
							{selectedSlot &&
								`${DAYS[selectedSlot.day]} à ${selectedSlot.time} - (30 minutes)`}
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-2 flex-wrap">
						{
							EVENTS.map((event) => (
								<Draggable id={event.id}>{event.alias}</Draggable>
							))
						}
					</div>
                    <DragOverlay className="flex gap-2">
						{isDropped ?
							draggedIds.map((id) => (
								<Badge key={id}>{id}</Badge>
							))
							: 'Drop here'
						}
                    </DragOverlay>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="title">Titre *</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="Nom de l'événement"
								/>
						</div>

						<div className="grid-cols-2 gap-4 hidden">
								<select
									id="startTime"
									value={formData.startTime}
									>
									{timeSlots.map((time) => (
										<option key={time} value={time}>
											{time}
										</option>
									))}
								</select>
							<select
								id="endTime"
								value={formData.endTime}
								>
								{timeSlots
									.filter((time) => time > formData.startTime)
									.map((time) => (
										<option key={time} value={time}>
											{time}
										</option>
									))}
							</select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder="Ajouter des détails..."
								rows={3}
								/>
						</div>
					</div>

					<DialogFooter className="flex-col sm:flex-row gap-2">
						{editingEvent && (
							<Button
							variant="destructive"
							onClick={handleDelete}
							className="sm:mr-auto"
							>
								<X className="w-4 h-4 mr-2" />
								Supprimer
							</Button>
						)}
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							Annuler
						</Button>
						<Button
							onClick={handleSave}
							disabled={
								!formData.title || !formData.startTime || !formData.endTime
							}
							>
							{editingEvent ? "Enregistrer" : "Créer"}
						</Button>
					</DialogFooter>
		    </DialogContent>
        </DndContext>
		);
		function handleDragEnd(event: DragEndEvent) {
			if (event.over && event.over.id === "droppable") {
				setIsDropped(true);
				setDraggedIds((prev) => [...prev, event.active.id]);
			}
		}
}