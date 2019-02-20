import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountPanelComponent } from './user-account-panel.component';

describe('UserAccountPanelComponent', () => {
  let component: UserAccountPanelComponent;
  let fixture: ComponentFixture<UserAccountPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
