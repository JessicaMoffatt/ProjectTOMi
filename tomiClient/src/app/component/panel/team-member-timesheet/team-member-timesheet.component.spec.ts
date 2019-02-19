import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberTimesheetComponent } from './team-member-timesheet.component';

describe('TeamMemberTimesheetComponent', () => {
  let component: TeamMemberTimesheetComponent;
  let fixture: ComponentFixture<TeamMemberTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
