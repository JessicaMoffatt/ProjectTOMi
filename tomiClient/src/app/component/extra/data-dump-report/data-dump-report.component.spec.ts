import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDumpReportComponent } from './data-dump-report.component';

describe('DataDumpReportComponent', () => {
  let component: DataDumpReportComponent;
  let fixture: ComponentFixture<DataDumpReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDumpReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDumpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
