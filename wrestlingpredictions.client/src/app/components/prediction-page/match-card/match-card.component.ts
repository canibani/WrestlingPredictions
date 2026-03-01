import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { EventDetails, MatchesWithPredictions } from '../../../models/event-details.model';
import { Match } from '../../../models/match/match.model';
import { Team } from '../../../models/team/team.model';
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

  private _eventId: string = "";
  @Input() set eventId(value: string) {
    this._eventId = value;
    if (value) this.loadMatches();
  }
  get eventId(): string {
    return this._eventId;
  }
  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    if (this.eventId) {
      this.loadMatches();
    }
  }

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

    return team.participants
      .join(', ');
  }

  //hasAnySelection(): boolean {
  //  return Object.keys(this.selectedTeams).length > 0;
  //}

  async loadMatches() {
    await this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.eventDetails = data;
        console.log(this.eventDetails);
      },
      error: (err) => {
      }
    });
  }

  savePredictions() {

    //const payload = Object.entries(this.selectedTeams).map(
    //  ([matchId, teamId]) => ({
    //    matchId: matchId,
    //    selectedTeamId: teamId
    //  })
    //);

    //console.log('Saving predictions:', payload);

    this.eventService.savePredicitions(this.eventDetails.matches).subscribe()
  }
}
