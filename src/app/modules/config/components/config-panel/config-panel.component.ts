import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/services';
import { InfoWarningComponent } from 'src/app/shared/components/info-warning/info-warning.component';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

import { FormDialogComponent } from '../form-dialog/form-dialog.component';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss']
})
export class ConfigPanelComponent implements OnDestroy {
  subscription: Subscription;
  isTgButtonChecked!: boolean;
  constructor(
    public dialog: MatDialog,
    public auth: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService
  ) {
    this.subscription = new Subscription();
    //Get value of dark-theme (true or false) and associate to toggle button
    this.subscription.add(this.loading.getIsDarkTheme().subscribe((value) => (this.isTgButtonChecked = value)));
  }

  //Redirect to Salon Data shared component with the user id
  editUserData(event: Event): void {
    event.stopPropagation();
    this.subscription.add(
      this.auth.getUserUID().subscribe((user) => {
        if (user?.uid) {
          void this.router.navigate(['sallonData', user!.uid], { relativeTo: this.route });
        }
      })
    );
  }

  //Event change function that is used to change theme to light (false) or dark (true)
  onDarkModeSwitched(toggle: MatSlideToggleChange) {
    this.loading.updateIsDarkTheme(toggle.checked);
  }
  //Opens a informative dialog with help info
  openInfoDialog(event: Event): void {
    event.stopPropagation();
    this.dialog.open(InfoWarningComponent, {
      data: {
        title: 'Precisa de ajuda?',
        contact: '916157954',
        email: 'marcomedeiros_03@outlook.com',
        adress: 'Avenida D. João III nº 132, Ponta Delgada, 9500-435',
        link: 'https://www.youtube.com/channel/UCgdDo0Pj3trCNlzVRoZ05pg/featured'
      }
    });
  }

  //Open dialog with a form to change email account
  openFormDialog(event: Event) {
    event.stopPropagation();
    this.dialog.open(FormDialogComponent);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
