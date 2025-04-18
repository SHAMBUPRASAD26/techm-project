import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant, PriceRange } from '../../models/restaurant.model';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit, OnDestroy {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  selectedCuisine = '';
  selectedPriceRange = '';
  selectedRating = '';
  cuisineTypes: string[] = [];
  private destroy$ = new Subject<void>();
  private searchDebounce$ = new Subject<string>();

  priceRanges = [
    { value: '', label: 'All Price Ranges' },
    { value: PriceRange.Budget.toString(), label: 'Budget' },
    { value: PriceRange.Moderate.toString(), label: 'Moderate' },
    { value: PriceRange.Expensive.toString(), label: 'Expensive' },
    { value: PriceRange.Luxury.toString(), label: 'Luxury' }
  ];

  ratingOptions = [
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Set up search debounce
    this.searchDebounce$.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.filterRestaurants();
    });

    // Subscribe to query params
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.selectedCuisine = params['cuisine'] || '';
      this.selectedPriceRange = params['priceRange'] || '';
      this.selectedRating = params['rating'] || '';
      this.filterRestaurants();
    });

    // Load initial data
    this.loadRestaurants();

    // Subscribe to cuisine types
    this.restaurantService.cuisineTypes$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(cuisineTypes => {
      this.cuisineTypes = cuisineTypes;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByRestaurantId(index: number, restaurant: Restaurant): number {
    return restaurant.id;
  }

  loadRestaurants(): void {
    this.loading = true;
    this.error = '';
    
    this.restaurantService.getRestaurants().subscribe({
      next: (restaurants) => {
        console.log('Loaded restaurants:', restaurants.length);
        this.restaurants = restaurants;
        this.filterRestaurants();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading restaurants:', error);
        this.error = error.message || 'Failed to load restaurants';
        this.loading = false;
      }
    });
  }

  refresh(): void {
    this.searchTerm = '';
    this.selectedCuisine = '';
    this.selectedPriceRange = '';
    this.selectedRating = '';
    this.updateQueryParams();
    this.loadRestaurants();
  }

  onSearchInput(event: any): void {
    const searchTerm = event.target.value;
    this.searchTerm = searchTerm;
    this.searchDebounce$.next(searchTerm);
    this.updateQueryParams();
  }

  onCuisineChange(event: any): void {
    this.selectedCuisine = event.target.value;
    this.updateQueryParams();
    this.filterRestaurants();
  }

  onPriceRangeChange(event: any): void {
    this.selectedPriceRange = event.target.value;
    this.updateQueryParams();
    this.filterRestaurants();
  }

  onRatingChange(event: any): void {
    this.selectedRating = event.target.value;
    this.updateQueryParams();
    this.filterRestaurants();
  }

  private updateQueryParams(): void {
    const queryParams: any = {};
    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.selectedCuisine) queryParams.cuisine = this.selectedCuisine;
    if (this.selectedPriceRange) queryParams.priceRange = this.selectedPriceRange;
    if (this.selectedRating) queryParams.rating = this.selectedRating;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  filterRestaurants(): void {
    this.loading = true;
    console.log('Filtering with:', {
      searchTerm: this.searchTerm,
      cuisine: this.selectedCuisine,
      priceRange: this.selectedPriceRange,
      rating: this.selectedRating
    });

    this.restaurantService.searchRestaurants(
      this.searchTerm,
      this.selectedCuisine,
      this.selectedPriceRange,
      this.selectedRating
    ).subscribe({
      next: (filtered) => {
        console.log('Filtered restaurants:', filtered.length);
        this.filteredRestaurants = filtered;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering restaurants:', error);
        this.error = 'Failed to filter restaurants';
        this.loading = false;
      }
    });
  }

  getImageUrl(restaurant: Restaurant): string {
    // Try to use the restaurant's image URL first
    if (restaurant.imageUrl) {
      return restaurant.imageUrl;
    }
    
    // If no specific image URL, try to use one of the existing images (1-12)
    const availableImages = 12; // We have images 1-12
    const imageIndex = (restaurant.id % availableImages) + 1;
    return `/assets/images/restaurant${imageIndex}.jpg`;
  }

  handleImageError(event: any): void {
    // If the image fails to load, use a placeholder image
    event.target.src = 'assets/images/placeholder.jpg';
  }

  getPriceRangeLabel(priceRange: PriceRange): string {
    switch (priceRange) {
      case PriceRange.Budget:
        return 'Budget';
      case PriceRange.Moderate:
        return 'Moderate';
      case PriceRange.Expensive:
        return 'Expensive';
      case PriceRange.Luxury:
        return 'Luxury';
      default:
        return 'Unknown';
    }
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="bi bi-star-fill text-warning"></i>';
    }
    if (halfStar) {
      stars += '<i class="bi bi-star-half text-warning"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="bi bi-star text-warning"></i>';
    }
    return stars;
  }

  viewRestaurantDetails(id: number): void {
    this.router.navigate(['/restaurants', id]);
  }
} 