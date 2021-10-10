import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

 private loading$: BehaviorSubject<boolean>;

  constructor() {
    this.loading$ = new BehaviorSubject<boolean>(false);
   }

  getLoadingState(): Observable<boolean> {
    return this.loading$;
  }

  updateLoading(value: boolean): void {
    this.loading$.next(value);
  }
}
