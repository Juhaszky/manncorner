import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCustomizerComponent } from './item-customizer.component';

describe('ItemCustomizerComponent', () => {
  let component: ItemCustomizerComponent;
  let fixture: ComponentFixture<ItemCustomizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCustomizerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemCustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
