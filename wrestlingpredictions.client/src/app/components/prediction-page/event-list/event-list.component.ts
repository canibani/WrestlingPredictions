import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event } from '../../../models/event/event.model';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {

  @Input() events: Event[] = [];
  @Input() selectedEventId: string | null = null;

  @Output() eventSelected = new EventEmitter<Event>();
  constructor(public authService: AuthenticationService) { }

  selectEvent(event: Event): void {
    this.eventSelected.emit(event);
    this.authService.hasRole("admin");
  }

  trackByEventId(index: number, event: Event): string {
    return event.id;
  }
}
