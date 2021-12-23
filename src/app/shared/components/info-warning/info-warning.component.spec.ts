import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoWarningComponent } from './info-warning.component';

describe('InfoWarningComponent', () => {
  let component: InfoWarningComponent;
  let fixture: ComponentFixture<InfoWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
