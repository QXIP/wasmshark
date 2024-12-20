/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnalyzeDataInMemoryService } from './analyze-data-in-memory.service';

describe('Service: AnalyzeDataInMemory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyzeDataInMemoryService]
    });
  });

  it('should ...', inject([AnalyzeDataInMemoryService], (service: AnalyzeDataInMemoryService) => {
    expect(service).toBeTruthy();
  }));
});
