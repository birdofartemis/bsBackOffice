import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss']
})
export class SelectBoxComponent implements OnInit {
  @Input() rowsText!: any[];
  @Output() values!: EventEmitter<any>;
  selectControl: FormControl;
  @Input() selectedValues: any;

  constructor() {
    this.values = new EventEmitter();
    this.selectControl = new FormControl();
  }

  getWeekDays() {
    this.values.emit(this.selectedValues);
  }

  ngOnInit(): void {}
}
