import { Component, OnInit } from '@angular/core';
import { Event } from '../../models/event/event.model';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-prediction-page',
  templateUrl: './prediction-page.component.html',
  styleUrls: ['./prediction-page.component.css']
})
export class PredictionPageComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | null = null;
  loading = false;
  error: string | null = null;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;

    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load events';
        this.loading = false;
      }
    });
  }

  onEventSelected(event: Event): void {
    this.selectedEvent = event;
  }

}
