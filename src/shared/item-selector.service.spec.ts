import { TestBed } from '@angular/core/testing';

import { ItemSelectorService } from './item-selector.service';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('ItemSelectorService', () => {
  let service: ItemSelectorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });
    service = TestBed.inject(ItemSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
