import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyItemPanelComponent } from './buy-item-panel.component';

describe('BuyItemPanelComponent', () => {
  let component: BuyItemPanelComponent;
  let fixture: ComponentFixture<BuyItemPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyItemPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyItemPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
