import { TestBed } from '@angular/core/testing';

import { UnitTypeSidebarService } from './unit-type-sidebar.service';

describe('UnitTypeSidebarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnitTypeSidebarService = TestBed.get(UnitTypeSidebarService);
    expect(service).toBeTruthy();
  });
});
