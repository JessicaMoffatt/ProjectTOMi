import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetPanelComponent } from './timesheet-panel.component';

describe('TimesheetPanelComponent', () => {
  let component: TimesheetPanelComponent;
  let fixture: ComponentFixture<TimesheetPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
