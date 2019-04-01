import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableHourReportComponent } from './billable-hour-report.component';

describe('BillableHourReportComponent', () => {
  let component: BillableHourReportComponent;
  let fixture: ComponentFixture<BillableHourReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillableHourReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillableHourReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
