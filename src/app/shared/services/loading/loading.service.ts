import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading$: BehaviorSubject<boolean>;
  private isDarkTheme$: BehaviorSubject<boolean>;

  constructor() {
    this.loading$ = new BehaviorSubject<boolean>(false);
    this.isDarkTheme$ = new BehaviorSubject<boolean>(false);
  }

  //Progress loading bar
  getLoadingState(): Observable<boolean> {
    return this.loading$;
  }

  updateLoading(value: boolean): void {
    this.loading$.next(value);
  }

  //Dark-Theme
  getIsDarkTheme(): Observable<boolean> {
    return this.isDarkTheme$;
  }

  updateIsDarkTheme(value: boolean): void {
    this.isDarkTheme$.next(value);
  }
}
