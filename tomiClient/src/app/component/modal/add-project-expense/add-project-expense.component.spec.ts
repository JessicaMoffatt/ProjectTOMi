import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectExpenseComponent } from './add-project-expense.component';

describe('AddProjectExpenseComponent', () => {
  let component: AddProjectExpenseComponent;
  let fixture: ComponentFixture<AddProjectExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
