import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services';
import { InfoWarningComponent } from 'src/app/shared/components/info-warning/info-warning.component';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

import { FormDialogComponent } from '../form-dialog/form-dialog.component';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss']
})
export class ConfigPanelComponent implements OnInit {
  isTgButtonChecked!: boolean;
  constructor(
    public dialog: MatDialog,
    public auth: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService
  ) {
    this.loading.getIsDarkTheme().subscribe((value) => (this.isTgButtonChecked = value));
  }

  ngOnInit(): void {
    this.loading.getIsDarkTheme().subscribe();
  }

  editUserData(event: Event): void {
    event.stopPropagation();
    this.auth.getUserUID().subscribe((user) => {
      if (user?.uid) {
        void this.router.navigate(['sallonData', user!.uid], { relativeTo: this.route });
      }
    });
  }

  onDarkModeSwitched(toggle: MatSlideToggleChange) {
    this.loading.updateIsDarkTheme(toggle.checked);
  }

  openInfoDialog(): void {
    this.dialog.open(InfoWarningComponent, {
      data: {
        title: 'Precisa de ajuda?',
        contact: '916157335',
        email: 'marcomedeiros_03@outlook.com',
        adress: 'Rua da Vila Nova de Cima 161, Ponta Delgada, 9500-249',
        link: 'https://www.youtube.com/channel/UCgdDo0Pj3trCNlzVRoZ05pg/featured'
      }
    });
  }

  openFormDialog() {
    this.dialog.open(FormDialogComponent);
  }
}
