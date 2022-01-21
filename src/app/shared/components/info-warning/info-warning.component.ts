import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-warning',
  templateUrl: './info-warning.component.html',
  styleUrls: ['./info-warning.component.scss']
})
export class InfoWarningComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title?: string; body?: string; link?: string; contact?: string; email?: string; adress?: string }
  ) {}

  ngOnInit(): void {}
}
