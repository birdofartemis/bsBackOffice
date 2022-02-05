import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AuthServiceService, FirestoreService } from 'src/app/services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  salonName!: string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthServiceService,
    private fs: FirestoreService
  ) {
    //loads Salon Name on the Page
    this.auth
      .getUserUID()
      .pipe(switchMap((user) => this.fs.getUserData(user!.uid)))
      .subscribe((res) => {
        this.salonName = res.data()!.enterpriseName;
      });
  }

  //Log out user from account and redirect him to loggin page
  logOut(event: Event): void {
    event.stopPropagation();
    this.auth.logOutUser().subscribe((res) => {
      this.router.navigate([''], { relativeTo: this.route });
    });
  }
}
