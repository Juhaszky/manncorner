import { ComponentRef, Directive, HostListener, Input, ViewContainerRef } from '@angular/core';
import { ItemDetailsComponent } from './item-details.component';

@Directive({
  selector: '[ItemDetails]',
  standalone: true,
})
export class ItemDetailsDirective {
  @Input('CommonTooltip') itemData: any;
  
  private tooltipRef!: ComponentRef<ItemDetailsComponent | null>;

  constructor(private viewContainerRef: ViewContainerRef) {}
  @HostListener('mouseenter') onMouseEnter() {
    console.log('mouseenter');

    this.tooltipRef = this.viewContainerRef.createComponent(ItemDetailsComponent);
    if (this.tooltipRef.instance) {
      this.tooltipRef.instance.itemData = this.itemData;
    }
    console.log(this.itemData);
  }
  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipRef) {
      this.tooltipRef.destroy();
    }
  }
}
