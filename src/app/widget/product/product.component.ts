import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PopupService, Product } from '../../services/popup.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
  @Input() product: Product | null = null;   // ✅ make it bindable
  @Input() visible: boolean = false;         // ✅ make it bindable

  private subscriptions: Subscription[] = [];

  constructor(private popupService: PopupService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.popupService.product$.subscribe(product => {
        console.log('🔵 Product Component: Received product:', product);
        this.product = product;
      })
    );

    this.subscriptions.push(
      this.popupService.productVisible$.subscribe(visible => {
        console.log('🔵 Product Component: Visibility changed:', visible);
        this.visible = visible;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closePopup() {
    console.log('❌ Product Component: Close button clicked');
    this.popupService.closeProductPopup();
  }

  onOverlayClick() {
    this.closePopup();
  }
}
