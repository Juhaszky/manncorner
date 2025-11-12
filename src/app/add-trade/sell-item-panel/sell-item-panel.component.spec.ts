import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellItemPanelComponent } from './sell-item-panel.component';

describe('SellItemPanelComponent', () => {
  let component: SellItemPanelComponent;
  let fixture: ComponentFixture<SellItemPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellItemPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellItemPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
