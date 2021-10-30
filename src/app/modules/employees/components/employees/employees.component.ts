import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RoutingService } from 'src/app/services/routing.service';

export interface Colaborators {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
}

const ELEMENT_DATA: Colaborators[] = [
  {name: 'Marco', surname: 'Hydrogen', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Ricardo', surname: 'Helium', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Filipe', surname: 'Lithium', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Alfonso', surname: 'Beryllium', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Rafael', surname: 'Boron', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Mauricio', surname: 'Carbon', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Francisco', surname: 'Nitrogen', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Rafaela', surname: 'Oxygen', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Francisca', surname: 'Fluorine', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
  {name: 'Leonor', surname: 'Neon', email: 'hydrogen@gmail.com', phoneNumber: '916156143'},
];

 
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements AfterViewInit {  

  constructor(private routeService: RoutingService) {
   }

  displayedColumns: string[] = ['name', 'surname', 'email', 'phoneNumber', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRow!: Colaborators;

  @ViewChild(MatTable)
  table!: MatTable<Colaborators>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  addColaborator(): void {
    this.routeService.navigate('home/employees/newemployee')
  }

  editColaborator(): void {

  }

  deleteColaborator(): void {
    //this.dataSource.data.filter(x => x.surname='Hydrogen').splice(1);
  }
}
