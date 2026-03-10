import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CreateMatchDto } from '../../../../models/match/create-match-dto.model';
import { EventService } from '../../../../services/event/event.service';

@Component({
  selector: 'app-add-match-modal',
  templateUrl: './add-match-modal.component.html',
  styleUrls: ['./add-match-modal.component.css']
})
export class AddMatchModalComponent implements OnInit {

  @Output() matchCreated = new EventEmitter<any>();
  @Input() eventId: string = "";

  showModal = false;
  matchForm: FormGroup;

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.matchForm = this.fb.group({
      matchName: ['', Validators.required],
      teams: this.fb.array([
        this.createTeam(),
        this.createTeam()
      ])
    });
  }

  ngOnInit(): void { }

  get teams(): FormArray {
    return this.matchForm.get('teams') as FormArray;
  }

  createTeam(): FormGroup {
    return this.fb.group({
      participants: this.fb.array([
        this.createParticipant()
      ])
    });
  }

  createParticipant(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required]
    });
  }

  getParticipants(teamIndex: number): FormArray {
    return this.teams.at(teamIndex).get('participants') as FormArray;
  }

  addTeam() {
    this.teams.push(this.createTeam());
  }

  removeTeam(index: number) {
    if (this.teams.length > 2) {
      this.teams.removeAt(index);
    }
  }

  addParticipant(teamIndex: number) {
    this.getParticipants(teamIndex).push(this.createParticipant());
  }

  removeParticipant(teamIndex: number, participantIndex: number) {
    const participants = this.getParticipants(teamIndex);

    if (participants.length > 1) {
      participants.removeAt(participantIndex);
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.matchForm.reset();
  }

  submitMatch() {
    if (this.matchForm.invalid) return;

    const match = this.matchForm.value;

    const dto: CreateMatchDto = {
      teams: match.teams.map((team: any) => ({
        participants: team.participants.map((p: any) => p.name) // extract names as strings
      }))
    };

    this.eventService.addMatchToEvent(this.eventId, [match]).subscribe({
      next: (response: any) => {
        this.closeModal();
        this.matchForm.reset();
        this.matchCreated.emit();
      },
      error: (error: any) => {
        console.error('Error adding event', error);
      }
    });
  }
}
