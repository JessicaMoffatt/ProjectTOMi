import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryApproveComponent } from './entry-approve.component';

describe('EntryApproveComponent', () => {
  let component: EntryApproveComponent;
  let fixture: ComponentFixture<EntryApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
