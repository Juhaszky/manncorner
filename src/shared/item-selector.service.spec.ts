import { TestBed } from '@angular/core/testing';

import { ItemSelectorService } from './item-selector.service';
import { HttpClient, HttpHandler, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {} from '@angular/common/http/testing'

describe('ItemSelectorService', () => {
  let service: ItemSelectorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [HttpClient, provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(ItemSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
