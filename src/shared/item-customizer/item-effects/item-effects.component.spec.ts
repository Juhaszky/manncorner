import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEffectsComponent } from './item-effects.component';

describe('ItemEffectsComponent', () => {
  let component: ItemEffectsComponent;
  let fixture: ComponentFixture<ItemEffectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemEffectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemEffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
