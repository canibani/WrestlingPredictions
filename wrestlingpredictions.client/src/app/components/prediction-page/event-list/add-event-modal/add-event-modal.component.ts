import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EventService } from "../../../../services/event/event.service";
import { CreateEventDto } from "../../../../models/event/new-event.model";

declare var bootstrap: any;

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.css']
})
export class AddEventModalComponent implements OnInit {

  eventForm!: FormGroup;

  modalInstance: any;
  @Output() eventCreated = new EventEmitter<void>();

  ngOnInit(): void {
  }

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  closeModal() {
    this.modalInstance.hide();
  }


  openModal() {
    const modalElement = document.getElementById('eventModal');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  submitEvent() {
    if (this.eventForm.invalid) return;

    var createEventDto: CreateEventDto = {
      name: this.eventForm.value.name,
    } 

    this.eventService.addEvent(createEventDto).subscribe({
        next: (response: any) => {
          this.closeModal();
          this.eventForm.reset();
          this.eventCreated.emit();
        },
        error: (error: any) => {
          console.error('Error adding event', error);
        }
      });
  }
}
