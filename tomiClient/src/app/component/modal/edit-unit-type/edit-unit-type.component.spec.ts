import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitTypeComponent } from './edit-unit-type.component';

describe('EditUnitTypeComponent', () => {
  let component: EditUnitTypeComponent;
  let fixture: ComponentFixture<EditUnitTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUnitTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
