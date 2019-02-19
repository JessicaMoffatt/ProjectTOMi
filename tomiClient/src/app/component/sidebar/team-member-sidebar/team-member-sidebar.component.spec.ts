import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberSidebarComponent } from './team-member-sidebar.component';

describe('TeamMemberSidebarComponent', () => {
  let component: TeamMemberSidebarComponent;
  let fixture: ComponentFixture<TeamMemberSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
