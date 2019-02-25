import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTypeSidebarComponent } from './unit-type-sidebar.component';

describe('UnitTypeSidebarComponent', () => {
  let component: UnitTypeSidebarComponent;
  let fixture: ComponentFixture<UnitTypeSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitTypeSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitTypeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
