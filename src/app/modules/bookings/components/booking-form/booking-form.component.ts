import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      client: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      service: ['', [Validators.required]],
      collaborator: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}
}
