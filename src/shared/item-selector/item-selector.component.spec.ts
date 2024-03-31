import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectorComponent } from './item-selector.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ItemSelectorComponent', () => {
  let component: ItemSelectorComponent;
  let fixture: ComponentFixture<ItemSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSelectorComponent],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
