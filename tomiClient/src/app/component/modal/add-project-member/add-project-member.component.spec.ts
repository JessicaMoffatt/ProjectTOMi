import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectMemberComponent } from './add-project-member.component';

describe('AddProjectMemberComponent', () => {
  let component: AddProjectMemberComponent;
  let fixture: ComponentFixture<AddProjectMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
