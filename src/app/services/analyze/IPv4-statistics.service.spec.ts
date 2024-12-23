/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IPv4StatisticsService } from './IPv4-statistics.service';

describe('Service: IPv4Statistics', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IPv4StatisticsService]
    });
  });

  it('should ...', inject([IPv4StatisticsService], (service: IPv4StatisticsService) => {
    expect(service).toBeTruthy();
  }));
});
