import { TestBed } from '@angular/core/testing';

import { UnitTypePanelService } from './unit-type-panel.service';

describe('UnitTypePanelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnitTypePanelService = TestBed.get(UnitTypePanelService);
    expect(service).toBeTruthy();
  });
});
