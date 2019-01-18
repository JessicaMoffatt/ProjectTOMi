import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTypesPanelComponent } from './unit-types-panel.component';

describe('UnitTypesPanelComponent', () => {
  let component: UnitTypesPanelComponent;
  let fixture: ComponentFixture<UnitTypesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitTypesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitTypesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
