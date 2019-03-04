import { TestBed } from '@angular/core/testing';

import { ProjectEntriesService } from './project-entries.service';

describe('ProjectEntriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectEntriesService = TestBed.get(ProjectEntriesService);
    expect(service).toBeTruthy();
  });
});
