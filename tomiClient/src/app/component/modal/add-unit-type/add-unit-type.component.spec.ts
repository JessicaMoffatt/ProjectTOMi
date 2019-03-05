import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitTypeComponent } from './add-unit-type.component';

describe('AddUnitTypeComponent', () => {
  let component: AddUnitTypeComponent;
  let fixture: ComponentFixture<AddUnitTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnitTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
