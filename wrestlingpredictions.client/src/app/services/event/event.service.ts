import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventDetails, MatchesWithPredictions } from '../../models/event-details.model';
import { Event } from '../../models/event/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  [x: string]: any;

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/event');
  }

  getEventById(id: string) {
    return this.http.get<EventDetails>(`/api/event/${id}`);
  }

  savePredicitions(matches: MatchesWithPredictions[]) {
    return this.http.post(
      `/api/prediction`,
      matches,
      { withCredentials: true }
    );
  }
}
