import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsAllComponent } from './reviews-all.component';

describe('ReviewsAllComponent', () => {
  let component: ReviewsAllComponent;
  let fixture: ComponentFixture<ReviewsAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
