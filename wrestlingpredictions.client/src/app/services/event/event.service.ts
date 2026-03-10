import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventDetails } from '../../models/event/event-details.model';
import { MatchesWithPredictions } from "../../models/event/match-with-predictions";
import { PredictionEvent } from '../../models/event/event.model';
import { CreateEventDto } from '../../models/event/new-event.model';
import { CreateMatchDto } from '../../models/match/create-match-dto.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<PredictionEvent[]> {
    return this.http.get<PredictionEvent[]>('/api/event');
  }

  getEventById(id: string) {
    return this.http.get<EventDetails>(`/api/event/${id}`);
  }

  savePredicitions(matches: MatchesWithPredictions[]) {
    return this.http.post(`/api/prediction`, matches, { withCredentials: true });
  }

  addEvent(createEventDto: CreateEventDto): Observable<any> {
    return this.http.post('/api/event', createEventDto, { withCredentials: true });
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`/api/event/${eventId}`);
  }

  addMatchToEvent(eventId: string, matches: CreateMatchDto[]): Observable<any> {
    return this.http.post(`/api/event/${eventId}/matches`, matches, { withCredentials: true });
  }
}
