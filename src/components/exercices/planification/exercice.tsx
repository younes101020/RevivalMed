import { Plus, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Event = {
	id: string;
	day: number;
	startTime: string;
	endTime: string;
	title: string;
	description?: string;
};

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const START_HOUR = 8;
const END_HOUR = 18;

function generateTimeSlots() {
	const slots: string[] = [];
	for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
		slots.push(`${hour.toString().padStart(2, "0")}:00`);
		if (hour < END_HOUR) {
			slots.push(`${hour.toString().padStart(2, "0")}:30`);
		}
	}
	return slots;
}

export function WeeklySchedule() {
	const [events, setEvents] = useState<Event[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState<{
		day: number;
		time: string;
	} | null>(null);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		startTime: "",
		endTime: "",
	});

	const timeSlots = generateTimeSlots();

	const handleSlotClick = (day: number, time: string) => {
		const endTimeIndex = timeSlots.indexOf(time) + 1;
		const endTime =
			endTimeIndex < timeSlots.length ? timeSlots[endTimeIndex] : time;

		setSelectedSlot({ day, time });
		setFormData({
			title: "",
			description: "",
			startTime: time,
			endTime,
		});
		setEditingEvent(null);
		setIsDialogOpen(true);
	};

	const handleEventClick = (event: Event, e: React.MouseEvent) => {
		e.stopPropagation();
		setEditingEvent(event);
		setFormData({
			title: event.title,
			description: event.description || "",
			startTime: event.startTime,
			endTime: event.endTime,
		});
		setSelectedSlot({ day: event.day, time: event.startTime });
		setIsDialogOpen(true);
	};

	const handleSave = () => {
		if (
			!formData.title ||
			!formData.startTime ||
			!formData.endTime ||
			!selectedSlot
		)
			return;

		if (editingEvent) {
			setEvents(
				events.map((e) =>
					e.id === editingEvent.id
						? {
								...e,
								title: formData.title,
								description: formData.description,
								startTime: formData.startTime,
								endTime: formData.endTime,
							}
						: e,
				),
			);
		} else {
			const newEvent: Event = {
				id: Date.now().toString(),
				day: selectedSlot.day,
				startTime: formData.startTime,
				endTime: formData.endTime,
				title: formData.title,
				description: formData.description,
			};
			setEvents([...events, newEvent]);
		}

		setIsDialogOpen(false);
		resetForm();
	};

	const handleDelete = () => {
		if (editingEvent) {
			setEvents(events.filter((e) => e.id !== editingEvent.id));
			setIsDialogOpen(false);
			resetForm();
		}
	};

	const resetForm = () => {
		setFormData({ title: "", description: "", startTime: "", endTime: "" });
		setSelectedSlot(null);
		setEditingEvent(null);
	};

	const getEventForSlot = (day: number, time: string) => {
		return events.find((e) => e.day === day && e.startTime === time);
	};

	const isEventContinuation = (day: number, time: string) => {
		return events.some((e) => {
			const startIndex = timeSlots.indexOf(e.startTime);
			const endIndex = timeSlots.indexOf(e.endTime);
			const currentIndex = timeSlots.indexOf(time);
			return (
				e.day === day && currentIndex > startIndex && currentIndex < endIndex
			);
		});
	};

	const getEventSpan = (event: Event) => {
		const startIndex = timeSlots.indexOf(event.startTime);
		const endIndex = timeSlots.indexOf(event.endTime);
		return endIndex - startIndex;
	};

	return (
		<>
			<div className="overflow-x-auto">
				<div className="min-w-[800px]">
					<div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-border bg-muted/30">
						<div className="p-4 text-sm font-medium text-muted-foreground">
							Heure
						</div>
						{DAYS.map((day) => (
							<div
								key={day}
								className="p-4 text-center text-sm font-semibold uppercase tracking-wide border-l border-border"
							>
								{day}
							</div>
						))}
					</div>

					<div className="relative">
						{timeSlots.map((time) => (
							<div
								key={time}
								className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-border group"
							>
								<div className="p-3 text-xs text-muted-foreground font-mono bg-muted/20">
									{time}
								</div>
								{DAYS.map((_, dayIndex) => {
									const event = getEventForSlot(dayIndex, time);
									const isContinuation = isEventContinuation(dayIndex, time);

									if (isContinuation) return null;

									if (event) {
										const span = getEventSpan(event);
										return (
											<div
												key={`${dayIndex}-${time}`}
												className={cn(
													"border-l border-border p-2 relative cursor-pointer hover:bg-accent/50 transition-colors",
												)}
												style={{ gridRow: `span ${span}` }}
												onClick={(e) => handleEventClick(event, e)}
											>
												<div className="h-full bg-primary rounded-md p-2 flex flex-col gap-1 overflow-hidden">
													<div className="flex items-start justify-between gap-2">
														<span className="text-xs font-semibold text-primary-foreground line-clamp-2">
															{event.title}
														</span>
													</div>
													<span className="text-xs text-primary-foreground/80 font-mono">
														{event.startTime} - {event.endTime}
													</span>
													{event.description && (
														<span className="text-xs text-primary-foreground/70 line-clamp-2 mt-1">
															{event.description}
														</span>
													)}
												</div>
											</div>
										);
									}

									return (
										<div
											key={`${dayIndex}-${time}`}
											className="border-l border-border p-2 min-h-[60px] hover:bg-accent/30 cursor-pointer transition-colors group/cell"
											onClick={() => handleSlotClick(dayIndex, time)}
										>
											<div className="h-full flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
												<Plus className="w-4 h-4 text-muted-foreground" />
											</div>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
			</Dialog>

			<DialogFooter className="sticky bottom-0">
				<Button>J'ai terminé</Button>
			</DialogFooter>
		</>
	);
}
