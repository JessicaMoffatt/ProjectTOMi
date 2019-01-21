import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsPanelComponent } from './user-accounts-panel.component';

describe('UserAccountsPanelComponent', () => {
  let component: UserAccountsPanelComponent;
  let fixture: ComponentFixture<UserAccountsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
