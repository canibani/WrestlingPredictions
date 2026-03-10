import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PredictionEvent } from '../../../models/event/event.model';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {

  @Input() events: PredictionEvent[] = [];
  @Input() selectedEventId: string | null = null;

  @Output() eventSelected = new EventEmitter<PredictionEvent>();
  @Output() eventCreated = new EventEmitter<void>();

  constructor(public authService: AuthenticationService, private eventService: EventService) { }

  selectEvent(event: PredictionEvent): void {
    this.eventSelected.emit(event);
    this.authService.hasRole("admin");
  }

  trackByEventId(index: number, event: PredictionEvent): string {
    return event.id;
  }

  loadEvents() {
    this.eventCreated.emit();
  }

  deleteEvent(eventId: string) {
    this.eventService.deleteEvent(eventId).subscribe(() => { this.loadEvents() });
  }
}
