import { TestBed } from '@angular/core/testing';

import { AddTradeService } from './add-trade.service';

describe('DashboardService', () => {
  let service: AddTradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
