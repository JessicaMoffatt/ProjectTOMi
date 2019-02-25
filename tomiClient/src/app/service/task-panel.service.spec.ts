import { TestBed } from '@angular/core/testing';

import { TaskPanelService } from './task-panel.service';

describe('TaskPanelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskPanelService = TestBed.get(TaskPanelService);
    expect(service).toBeTruthy();
  });
});
