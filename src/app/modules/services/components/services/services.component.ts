import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthServiceService, FirestoreService } from 'src/app/services';
import { Service } from 'src/app/shared/model/service.module';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['photo', 'name', 'price', 'actions'];
  dataSource!: MatTableDataSource<Service>;

  @ViewChild(MatTable) table!: MatTable<Service>;

  constructor(
    private router: Router, private route: ActivatedRoute, private fs: FirestoreService, 
    private auth: AuthServiceService, /*private subscription: Subscription*/
    ) {
     // this.subscription = new Subscription();
     }
  
  ngOnInit(): void {
    //this.subscription.add(
      this.auth.getUserUID().pipe(switchMap(
        ( user ) => this.fs.getServices(user!.uid))).subscribe((res) => {
           this.dataSource = new MatTableDataSource(res);
      });
   //);
  }

  ngOnDestroy(): void {
   // this.subscription.unsubscribe();
  }

  addService(): void {
    this.router.navigate(['newservice'], { relativeTo: this.route })
  }

  editService(event: Event, service: Service): void {
    event.stopPropagation();
    void this.router.navigate(['newservice', service.idDocument], { relativeTo: this.route })

  }

  deleteService(event: Event, service: Service): void {
    event.stopPropagation();
    this.auth.getUserUID().subscribe(user => {
      this.fs.deleteServiceData(user!.uid, service.name);
    });
  }
}
