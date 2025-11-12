import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PopupService, Review } from '../../services/popup.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']  
})
export class ReviewComponent implements OnInit, OnDestroy {
  @Input() review: Review | null = null;   
  @Input() visible: boolean = false;       
  
  private subscriptions: Subscription[] = [];

  constructor(private popupService: PopupService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.popupService.review$.subscribe(review => {
        console.log('🔵 Review Component: Received review:', review);
        this.review = review;
      })
    );

    // Subscribe to visibility changes (optional redundancy)
    this.subscriptions.push(
      this.popupService.reviewVisible$.subscribe(visible => {
        console.log('🔵 Review Component: Visibility changed:', visible);
        this.visible = visible;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closePopup() {
    console.log('❌ Review Component: Close button clicked');
    this.popupService.closeReviewPopup();
  }

  onOverlayClick() {
    this.closePopup();
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? 'star' : 'star_border');
  }
}
