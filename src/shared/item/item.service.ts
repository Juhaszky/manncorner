import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  showItemDetails = false;
  isMobile = false;

  setShowItemDetails() {
    this.showItemDetails = !this.showItemDetails;
  }
  setIsMobileFlag() {
    this.isMobile = !this.isMobile;
  }

}