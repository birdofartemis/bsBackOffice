import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services';
import { InfoWarningComponent } from 'src/app/shared/components/info-warning/info-warning.component';

import { FormDialogComponent } from '../form-dialog/form-dialog.component';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss']
})
export class ConfigPanelComponent implements OnInit {
  constructor(public dialog: MatDialog, public auth: AuthServiceService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  editUserData(event: Event): void {
    event.stopPropagation();
    this.auth.getUserUID().subscribe((user) => {
      if (user?.uid) {
        void this.router.navigate(['sallonData', user!.uid], { relativeTo: this.route });
      }
    });
  }

  openInfoDialog(): void {
    this.dialog.open(InfoWarningComponent, {
      data: {
        title: 'Precisa de ajuda?',
        body: 'Consulte o seguinte link:',
        link: 'https://www.youtube.com/channel/UCgdDo0Pj3trCNlzVRoZ05pg/featured'
      }
    });
  }

  openFormDialog() {
    this.dialog.open(FormDialogComponent);
  }
}
