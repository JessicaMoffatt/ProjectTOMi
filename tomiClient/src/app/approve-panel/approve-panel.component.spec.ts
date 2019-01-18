import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePanelComponent } from './approve-panel.component';

describe('ApprovePanelComponent', () => {
  let component: ApprovePanelComponent;
  let fixture: ComponentFixture<ApprovePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
