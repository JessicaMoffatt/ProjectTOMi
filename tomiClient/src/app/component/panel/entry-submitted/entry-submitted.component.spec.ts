import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySubmittedComponent } from './entry-submitted.component';

describe('EntrySubmittedComponent', () => {
  let component: EntrySubmittedComponent;
  let fixture: ComponentFixture<EntrySubmittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrySubmittedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
