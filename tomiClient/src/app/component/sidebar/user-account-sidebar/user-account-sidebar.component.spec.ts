import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountSidebarComponent } from './user-account-sidebar.component';

describe('UserAccountSidebarComponent', () => {
  let component: UserAccountSidebarComponent;
  let fixture: ComponentFixture<UserAccountSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
