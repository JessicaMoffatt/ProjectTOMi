import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjectsPanelComponent } from './manage-projects-panel.component';

describe('ManageProjectsPanelComponent', () => {
  let component: ManageProjectsPanelComponent;
  let fixture: ComponentFixture<ManageProjectsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProjectsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProjectsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
