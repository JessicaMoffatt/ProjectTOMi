import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSidebarComponent } from './team-sidebar.component';

describe('TeamSidebarComponent', () => {
  let component: TeamSidebarComponent;
  let fixture: ComponentFixture<TeamSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
