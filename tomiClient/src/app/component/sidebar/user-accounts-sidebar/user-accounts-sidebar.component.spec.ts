import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsSidebarComponent } from './user-accounts-sidebar.component';

describe('UserAccountsSidebarComponent', () => {
  let component: UserAccountsSidebarComponent;
  let fixture: ComponentFixture<UserAccountsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
