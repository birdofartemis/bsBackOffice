import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private route: ActivatedRoute, private auth: AuthServiceService) { }

  ngOnInit(): void {
  }

  logOut(event: Event): void {
    event.stopPropagation();
    this.auth.logOutUser().subscribe(
      res => {
        this.router.navigate([''], { relativeTo: this.route });
      }
    )
  }
}
