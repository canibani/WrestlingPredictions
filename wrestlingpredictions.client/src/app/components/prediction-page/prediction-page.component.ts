import { Component, OnInit } from '@angular/core';
import { PredictionEvent } from '../../models/event/event.model';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-prediction-page',
  templateUrl: './prediction-page.component.html',
  styleUrls: ['./prediction-page.component.css']
})
export class PredictionPageComponent implements OnInit {
  events: PredictionEvent[] = [];
  selectedEvent: PredictionEvent | null = null;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
      }
    });
  }

  onEventSelected(event: PredictionEvent): void {
    this.selectedEvent = event;
  }

}
