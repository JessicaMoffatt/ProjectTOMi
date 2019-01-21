import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeamsPanelComponent } from './manage-teams-panel.component';

describe('ManageTeamsPanelComponent', () => {
  let component: ManageTeamsPanelComponent;
  let fixture: ComponentFixture<ManageTeamsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTeamsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
