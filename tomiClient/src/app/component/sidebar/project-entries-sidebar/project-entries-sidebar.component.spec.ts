import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEntriesSidebarComponent } from './project-entries-sidebar.component';

describe('ProjectEntriesSidebarComponent', () => {
  let component: ProjectEntriesSidebarComponent;
  let fixture: ComponentFixture<ProjectEntriesSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectEntriesSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEntriesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
