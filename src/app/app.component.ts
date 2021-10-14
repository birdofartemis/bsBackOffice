import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LoadingService } from './shared/services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'bsBackoffice';
  loading$!: Observable<boolean>;


  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loading$ = this.loadingService.getLoadingState();
  }
}
