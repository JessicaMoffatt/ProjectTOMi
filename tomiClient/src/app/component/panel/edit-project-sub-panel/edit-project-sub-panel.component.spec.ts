import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectSubPanelComponent } from './edit-project-sub-panel.component';

describe('EditProjectSubPanelComponent', () => {
  let component: EditProjectSubPanelComponent;
  let fixture: ComponentFixture<EditProjectSubPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectSubPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectSubPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
