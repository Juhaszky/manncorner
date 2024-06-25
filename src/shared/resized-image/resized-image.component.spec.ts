import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizedImageComponent } from './resized-image.component';

describe('ResizedImageComponent', () => {
  let component: ResizedImageComponent;
  let fixture: ComponentFixture<ResizedImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizedImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResizedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
