import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { EventDetails } from '../../../models/event/event-details.model';
import { MatchesWithPredictions } from "../../../models/event/match-with-predictions";
import { Team } from '../../../models/team/team.model';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.css']
})
export class MatchCardComponent implements OnInit {

  eventDetails: EventDetails = {
    id: '',
    name: '',
    matches: []
  };

  public _eventId: string = "";
  @Input() set eventId(value: string) {
    this._eventId = value;
    if (value) this.loadMatches();
  }
  get eventId(): string {
    return this._eventId;
  }

  constructor(public authService: AuthenticationService, private eventService: EventService) { }

  ngOnInit(): void { }

  trackByMatchId(index: number, match: MatchesWithPredictions): string {
    return match.matchId;
  }

  selectTeam(matchId: string, teamId: string) {
    var match = this.eventDetails?.matches.find(m => m.matchId == matchId);
    if (match) {
      match.userPredictionTeamId = teamId;
    }
  }

  getSelectedTeamName(match: MatchesWithPredictions): string {
    const selectedId = match.userPredictionTeamId;

    if (!selectedId) return 'Select Winner';

    const team = match.teams.find(t => t.id === selectedId);
    return team?.teamName || team?.participants.join(', ') || 'Select Winner';
  }

  getTeamDisplayName(team: Team): string {
    if (team.teamName) {
      return team.teamName;
    }

    return team.participants.join(', ');
  }

  //hasAnySelection(): boolean {
  //  return Object.keys(this.selectedTeams).length > 0;
  //}

  async loadMatches() {
    await this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.eventDetails = data;
      },
      error: (err) => {
      }
    });
  }

  savePredictions() {
    this.eventService.savePredicitions(this.eventDetails.matches).subscribe()
  }
}
