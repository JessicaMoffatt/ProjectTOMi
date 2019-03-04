import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryUneditableComponent } from './entry-uneditable.component';

describe('EntryUneditableComponent', () => {
  let component: EntryUneditableComponent;
  let fixture: ComponentFixture<EntryUneditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryUneditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryUneditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
