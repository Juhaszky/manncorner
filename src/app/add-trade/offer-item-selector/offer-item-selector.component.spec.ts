import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferItemSelectorComponent } from './offer-item-selector.component';

describe('OfferItemSelectorComponent', () => {
  let component: OfferItemSelectorComponent;
  let fixture: ComponentFixture<OfferItemSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferItemSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
