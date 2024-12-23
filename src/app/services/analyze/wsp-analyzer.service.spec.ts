/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WspAnalyzerService } from './wsp-analyzer.service';

describe('Service: WspAnalyzer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WspAnalyzerService]
    });
  });

  it('should ...', inject([WspAnalyzerService], (service: WspAnalyzerService) => {
    expect(service).toBeTruthy();
  }));
});
