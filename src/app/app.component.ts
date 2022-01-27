import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';

import { LoadingService } from './shared/services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bsBackoffice';
  loading$!: Observable<boolean>;
  isDarkTheme$!: Observable<boolean>;
  isDark: boolean;

  constructor(private loadingService: LoadingService, @Inject(DOCUMENT) private document: Document, private render: Renderer2) {
    this.isDark = false;
    this.isDarkTheme$ = this.loadingService.getIsDarkTheme();
    this.isDarkTheme$.subscribe((value) => (this.isDark = value));
  }

  //Loads theme
  @HostBinding('class')
  get themeMode() {
    let hostClass = this.isDark ? 'theme-dark' : 'theme-light';
    this.render.setAttribute(this.document.body, 'class', hostClass);
    return;
  }

  ngOnInit(): void {
    this.loading$ = this.loadingService.getLoadingState();
  }
}
