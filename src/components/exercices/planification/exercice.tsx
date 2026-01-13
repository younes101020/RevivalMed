import { Info, Plus, RotateCcw } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { EventsDescription } from "./components/events-description";
import { EventsDialog } from "./components/events-dialog";
import { Event } from "./types/event";
import { DAYS } from "./const/days";

const START_HOUR = 8;
const END_HOUR = 18;

const DAYS_OFF = [
		// Lundi (0) de 8h à 16h
		{ day: 0, time: "08:00" },
		{ day: 0, time: "08:30" },
		{ day: 0, time: "09:00" },
		{ day: 0, time: "09:30" },
		{ day: 0, time: "10:00" },
		{ day: 0, time: "10:30" },
		{ day: 0, time: "11:00" },
		{ day: 0, time: "11:30" },
		{ day: 0, time: "12:00" },
		{ day: 0, time: "12:30" },
		{ day: 0, time: "13:00" },
		{ day: 0, time: "13:30" },
		{ day: 0, time: "14:00" },
		{ day: 0, time: "14:30" },
		{ day: 0, time: "15:00" },
		{ day: 0, time: "15:30" },
		// Mardi (1) de 8h à 16h
		{ day: 1, time: "08:00" },
		{ day: 1, time: "08:30" },
		{ day: 1, time: "09:00" },
		{ day: 1, time: "09:30" },
		{ day: 1, time: "10:00" },
		{ day: 1, time: "10:30" },
		{ day: 1, time: "11:00" },
		{ day: 1, time: "11:30" },
		{ day: 1, time: "12:00" },
		{ day: 1, time: "12:30" },
		{ day: 1, time: "13:00" },
		{ day: 1, time: "13:30" },
		{ day: 1, time: "14:00" },
		{ day: 1, time: "14:30" },
		{ day: 1, time: "15:00" },
		{ day: 1, time: "15:30" },
		// Mercredi (2) de 8h à 12h
		{ day: 2, time: "08:00" },
		{ day: 2, time: "08:30" },
		{ day: 2, time: "09:00" },
		{ day: 2, time: "09:30" },
		{ day: 2, time: "10:00" },
		{ day: 2, time: "10:30" },
		{ day: 2, time: "11:00" },
		{ day: 2, time: "11:30" },
		// Jeudi (3) de 8h à 16h
		{ day: 3, time: "08:00" },
		{ day: 3, time: "08:30" },
		{ day: 3, time: "09:00" },
		{ day: 3, time: "09:30" },
		{ day: 3, time: "10:00" },
		{ day: 3, time: "10:30" },
		{ day: 3, time: "11:00" },
		{ day: 3, time: "11:30" },
		{ day: 3, time: "12:00" },
		{ day: 3, time: "12:30" },
		{ day: 3, time: "13:00" },
		{ day: 3, time: "13:30" },
		{ day: 3, time: "14:00" },
		{ day: 3, time: "14:30" },
		{ day: 3, time: "15:00" },
		{ day: 3, time: "15:30" },
		// Vendredi (4) de 8h à 12h
		{ day: 4, time: "08:00" },
		{ day: 4, time: "08:30" },
		{ day: 4, time: "09:00" },
		{ day: 4, time: "09:30" },
		{ day: 4, time: "10:00" },
		{ day: 4, time: "10:30" },
		{ day: 4, time: "11:00" },
		{ day: 4, time: "11:30" },
	];

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
	// Définir les slots désactivés (jour: 0=Lundi, 1=Mardi, 2=Mercredi, 3=Jeudi, 4=Vendredi, 5=Samedi)
	const [daysOffSlots, setDaysOffSlots] = useState(DAYS_OFF);
	const [remainingDayOff, setRemainingDayOff] = useState(3);

	const timeSlots = generateTimeSlots();

	const setDayOff = (day: number) => {
		setDaysOffSlots((prev) => {
			return prev.filter((d) => d.day !== day);
		});
		setRemainingDayOff((prev) => prev - 1);
	}

	const resetDayOffs = () => {
		setDaysOffSlots(DAYS_OFF);
		setRemainingDayOff(3);
	};

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

	const handleSubmit = () => {
		console.log("Planning soumis :", events);
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

	const isSlotDisabled = (day: number, time: string) => {
		return daysOffSlots.some(
			(slot) => slot.day === day && slot.time === time,
		);
	};

	return (
		<>
			<div className="overflow-x-auto">
				<dl className="bg-primary rounded px-1 text-sm my-2 py-2">
					<dt>Jours de congé restants</dt>
					<dd className="flex justify-between gap-2 items-center">
						{remainingDayOff}
						{
							remainingDayOff < 3 && (
							<Button
								className="text-xs"
								onClick={resetDayOffs}
							>
								<RotateCcw /> Réinitialiser
							</Button>
							)
						}
					</dd>
				</dl>
				<div>
					<div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-border bg-muted/30">
						<div className="p-4 text-sm font-medium text-muted-foreground">
							Heure
						</div>
						<ColumnsHeader />
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
							const disabled = isSlotDisabled(dayIndex, time);

							if (isContinuation) return null;

							// Slot désactivé
							if (disabled) {
								return <DayOffCell
											key={`${dayIndex}-${time}`}
											remainingDayOff={remainingDayOff}
											handleDayOff={() => setDayOff(dayIndex)}
										/>
							}

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

									return <AvailableDayCell key={`${dayIndex}-${time}`} handleSlotClick={() => handleSlotClick(dayIndex, time)} />
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<EventsDialog
					editingEvent={editingEvent}
					selectedSlot={selectedSlot}
					formData={formData}
					setFormData={setFormData}
					timeSlots={timeSlots}
					handleDelete={handleDelete}
					setIsDialogOpen={setIsDialogOpen}
					handleSave={handleSave}
				/>
			</Dialog>

			<DialogFooter className="sticky bottom-0">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant={"link"}>
							<Info />
							Récap. des événements
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-lg">
						<DialogTitle>Événements à planifier</DialogTitle>
						<EventsDescription />
					</DialogContent>
				</Dialog>
				<Button onClick={handleSubmit}>J'ai terminé</Button>
			</DialogFooter>
		</>
	);
}

function AvailableDayCell({ handleSlotClick }: { handleSlotClick: () => void }) {
	return (
		<div
			className="border-l border-border p-2 min-h-[60px] hover:bg-accent/30 cursor-pointer transition-colors group/cell"
			onClick={handleSlotClick}
		>
			<div className="h-full flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
				<Plus className="w-4 h-4 text-muted-foreground" />
			</div>
		</div>
	)
}

interface DayOffCellProps {
	remainingDayOff: number;
	handleDayOff: () => void;
}

function DayOffCell({ remainingDayOff, handleDayOff }: DayOffCellProps) {
	return (
		<div
			className={cn(
				"border-l border-border p-2 min-h-[60px] bg-muted/50 group/disabled",
				remainingDayOff <= 0 ? "cursor-not-allowed" : "cursor-pointer hover:border-2",
			)}
			onClick={() => {
				if (remainingDayOff > 0) {
					handleDayOff();
				}
			}}
		>
			<div className="relative h-full flex items-center justify-center">
				<span className="text-muted-foreground/50">
					Travail
				</span>
				{remainingDayOff > 0 && (
					<span className="hidden group-hover/disabled:block text-xs absolute bottom-[-.5rem] bg-primary text-primary-foreground pl-1 pr-4 left-[-.5rem] rounded-tr-2xl ">
						+ Congé
					</span>
				)}
			</div>
		</div>
	)
}

function ColumnsHeader() {
	return (
		DAYS.map((day) => (
				<div
					key={day}
					className="p-4 text-center text-sm font-semibold uppercase tracking-wide border-l border-border"
				>
					{day}
				</div>
		))
	)
}