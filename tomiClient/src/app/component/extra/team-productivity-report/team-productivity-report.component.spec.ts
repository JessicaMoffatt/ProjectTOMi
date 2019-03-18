import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamProductivityReportComponent } from './team-productivity-report.component';

describe('TeamProductivityReportComponent', () => {
  let component: TeamProductivityReportComponent;
  let fixture: ComponentFixture<TeamProductivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamProductivityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamProductivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
