import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Restaurant, CreateRestaurant, UpdateRestaurant, PriceRange } from '../models/restaurant.model';
import { environment } from '../../environments/environment';
import { Review } from '../models/review.model';
import { RestaurantResponseDTO } from '../models/restaurant-response.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = `${environment.apiUrl}/api/restaurant`;
  private restaurants: Restaurant[] = [];
  private restaurantsSubject = new BehaviorSubject<Restaurant[]>([]);
  restaurants$ = this.restaurantsSubject.asObservable();

  // Add cuisine types subject
  private cuisineTypesSubject = new BehaviorSubject<string[]>([]);
  cuisineTypes$ = this.cuisineTypesSubject.asObservable();

  private reviewsMap = new Map<number, Review[]>();

  private initialRestaurants: Restaurant[] = [
    {
      id: 1,
      name: "Spice Garden",
      description: "Authentic Indian cuisine with a modern twist",
      cuisine: "Indian",
      cuisineType: "Indian",
      priceRange: PriceRange.Moderate,
      rating: 4.5,
      averageRating: 4.5,
      reviewCount: 128,
      imageUrl: "/assets/images/restaurant1.jpg",
      address: "123 Curry Lane, Foodville",
      phoneNumber: "(555) 123-4567",
      website: "https://spicegarden.example.com",
      dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"],
      openingHours: ["Monday-Sunday: 11:00 AM - 10:00 PM"],
      reviews: []
    },
    {
      id: 2,
      name: "Sushi Master",
      description: "Premium sushi and Japanese delicacies",
      cuisine: "Japanese",
      cuisineType: "Japanese",
      priceRange: PriceRange.Expensive,
      rating: 4.8,
      averageRating: 4.8,
      reviewCount: 256,
      imageUrl: "/assets/images/restaurant2.jpg",
      address: "456 Sushi Street, Foodville",
      phoneNumber: "(555) 234-5678",
      website: "https://sushimaster.example.com",
      dietaryOptions: ["Vegetarian", "Gluten-Free"],
      openingHours: ["Tuesday-Sunday: 12:00 PM - 11:00 PM", "Monday: Closed"],
      reviews: []
    },
    {
      id: 3,
      name: "Pasta Paradise",
      description: "Traditional Italian pasta and pizza",
      cuisine: "Italian",
      cuisineType: "Italian",
      priceRange: PriceRange.Moderate,
      rating: 4.3,
      averageRating: 4.3,
      reviewCount: 312,
      imageUrl: "/assets/images/restaurant3.jpg",
      address: "789 Pasta Place, Foodville",
      phoneNumber: "(555) 345-6789",
      website: "https://pastaparadise.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 11:30 AM - 10:30 PM"],
      reviews: []
    },
    {
      id: 4,
      name: "Burger Bliss",
      description: "Gourmet burgers and craft beers",
      cuisine: "American",
      cuisineType: "American",
      priceRange: PriceRange.Budget,
      rating: 4.2,
      averageRating: 4.2,
      reviewCount: 189,
      imageUrl: "/assets/images/restaurant4.jpg",
      address: "321 Burger Blvd, Foodville",
      phoneNumber: "(555) 456-7890",
      website: "https://burgerbliss.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 11:00 AM - 11:00 PM"],
      reviews: []
    },
    {
      id: 5,
      name: "Thai Orchid",
      description: "Authentic Thai street food experience",
      cuisine: "Thai",
      cuisineType: "Thai",
      priceRange: PriceRange.Budget,
      rating: 4.4,
      averageRating: 4.4,
      reviewCount: 245,
      imageUrl: "/assets/images/restaurant5.jpg",
      address: "567 Spice Avenue, Foodville",
      phoneNumber: "(555) 567-8901",
      website: "https://thaiorchid.example.com",
      dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"],
      openingHours: ["Monday-Sunday: 11:30 AM - 10:00 PM"],
      reviews: []
    },
    {
      id: 6,
      name: "Mediterranean Oasis",
      description: "Fresh Mediterranean dishes and mezze",
      cuisine: "Mediterranean",
      cuisineType: "Mediterranean",
      priceRange: PriceRange.Moderate,
      rating: 4.6,
      averageRating: 4.6,
      reviewCount: 178,
      imageUrl: "/assets/images/restaurant6.jpg",
      address: "890 Olive Lane, Foodville",
      phoneNumber: "(555) 678-9012",
      website: "https://medoasis.example.com",
      dietaryOptions: ["Vegetarian", "Vegan", "Halal"],
      openingHours: ["Tuesday-Sunday: 11:00 AM - 9:30 PM", "Monday: Closed"],
      reviews: []
    },
    {
      id: 7,
      name: "Dragon Palace",
      description: "Traditional Chinese cuisine and dim sum",
      cuisine: "Chinese",
      cuisineType: "Chinese",
      priceRange: PriceRange.Expensive,
      rating: 4.7,
      averageRating: 4.7,
      reviewCount: 289,
      imageUrl: "/assets/images/restaurant7.jpg",
      address: "432 Dragon Street, Foodville",
      phoneNumber: "(555) 789-0123",
      website: "https://dragonpalace.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 11:00 AM - 10:30 PM"],
      reviews: []
    },
    {
      id: 8,
      name: "Steakhouse Supreme",
      description: "Premium steaks and fine wines",
      cuisine: "Steakhouse",
      cuisineType: "Steakhouse",
      priceRange: PriceRange.Luxury,
      rating: 4.9,
      averageRating: 4.9,
      reviewCount: 342,
      imageUrl: "/assets/images/restaurant8.jpg",
      address: "765 Grill Road, Foodville",
      phoneNumber: "(555) 890-1234",
      website: "https://steakhouse.example.com",
      dietaryOptions: ["Gluten-Free"],
      openingHours: ["Monday-Sunday: 5:00 PM - 11:00 PM"],
      reviews: []
    },
    {
      id: 9,
      name: "Taco Fiesta",
      description: "Authentic Mexican street tacos",
      cuisine: "Mexican",
      cuisineType: "Mexican",
      priceRange: PriceRange.Budget,
      rating: 4.3,
      averageRating: 4.3,
      reviewCount: 156,
      imageUrl: "/assets/images/restaurant9.jpg",
      address: "543 Taco Trail, Foodville",
      phoneNumber: "(555) 901-2345",
      website: "https://tacofiesta.example.com",
      dietaryOptions: ["Vegetarian", "Vegan"],
      openingHours: ["Monday-Sunday: 11:00 AM - 11:00 PM"],
      reviews: []
    },
    {
      id: 10,
      name: "French Bistro",
      description: "Classic French cuisine in an elegant setting",
      cuisine: "French",
      cuisineType: "French",
      priceRange: PriceRange.Luxury,
      rating: 4.8,
      averageRating: 4.8,
      reviewCount: 267,
      imageUrl: "/assets/images/restaurant10.jpg",
      address: "876 Bistro Boulevard, Foodville",
      phoneNumber: "(555) 012-3456",
      website: "https://frenchbistro.example.com",
      dietaryOptions: ["Vegetarian", "Gluten-Free"],
      openingHours: ["Tuesday-Sunday: 5:00 PM - 10:00 PM", "Monday: Closed"],
      reviews: []
    },
    {
      id: 11,
      name: "Seoul Kitchen",
      description: "Modern Korean BBQ and traditional dishes",
      cuisine: "Korean",
      cuisineType: "Korean",
      priceRange: PriceRange.Moderate,
      rating: 4.5,
      averageRating: 4.5,
      reviewCount: 198,
      imageUrl: "/assets/images/restaurant11.jpg",
      address: "234 Seoul Street, Foodville",
      phoneNumber: "(555) 123-4567",
      website: "https://seoulkitchen.example.com",
      dietaryOptions: ["Vegetarian", "Gluten-Free"],
      openingHours: ["Monday-Sunday: 11:30 AM - 10:00 PM"],
      reviews: []
    },
    {
      id: 12,
      name: "Seafood Harbor",
      description: "Fresh seafood and coastal cuisine",
      cuisine: "Seafood",
      cuisineType: "Seafood",
      priceRange: PriceRange.Expensive,
      rating: 4.7,
      averageRating: 4.7,
      reviewCount: 223,
      imageUrl: "/assets/images/restaurant12.jpg",
      address: "987 Harbor View, Foodville",
      phoneNumber: "(555) 234-5678",
      website: "https://seafoodharbor.example.com",
      dietaryOptions: ["Gluten-Free"],
      openingHours: ["Monday-Sunday: 11:00 AM - 10:00 PM"],
      reviews: []
    },
    {
      id: 11,
      name: "Quick Bites",
      description: "Fast food and quick meals",
      cuisine: "Fast Food",
      cuisineType: "Fast Food",
      priceRange: PriceRange.Budget,
      rating: 1.2,
      averageRating: 1.2,
      reviewCount: 45,
      imageUrl: "/assets/images/restaurant11.jpg",
      address: "111 Fast Lane, Foodville",
      phoneNumber: "(555) 111-1111",
      website: "https://quickbites.example.com",
      dietaryOptions: [],
      openingHours: ["Monday-Sunday: 24/7"],
      reviews: []
    },
    {
      id: 12,
      name: "Pizza Express",
      description: "Basic pizza and pasta dishes",
      cuisine: "Italian",
      cuisineType: "Italian",
      priceRange: PriceRange.Budget,
      rating: 2.3,
      averageRating: 2.3,
      reviewCount: 78,
      imageUrl: "/assets/images/restaurant12.jpg",
      address: "222 Pizza Street, Foodville",
      phoneNumber: "(555) 222-2222",
      website: "https://pizzaexpress.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 11:00 AM - 11:00 PM"],
      reviews: []
    },
    {
      id: 13,
      name: "Noodle House",
      description: "Simple Asian noodle dishes",
      cuisine: "Asian",
      cuisineType: "Asian",
      priceRange: PriceRange.Budget,
      rating: 2.8,
      averageRating: 2.8,
      reviewCount: 92,
      imageUrl: "/assets/images/restaurant13.jpg",
      address: "333 Noodle Road, Foodville",
      phoneNumber: "(555) 333-3333",
      website: "https://noodlehouse.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 11:00 AM - 10:00 PM"],
      reviews: []
    },
    {
      id: 14,
      name: "Cafe Corner",
      description: "Basic cafe with sandwiches and coffee",
      cuisine: "Cafe",
      cuisineType: "Cafe",
      priceRange: PriceRange.Budget,
      rating: 3.1,
      averageRating: 3.1,
      reviewCount: 120,
      imageUrl: "/assets/images/restaurant14.jpg",
      address: "444 Cafe Avenue, Foodville",
      phoneNumber: "(555) 444-4444",
      website: "https://cafecorner.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 7:00 AM - 7:00 PM"],
      reviews: []
    },
    {
      id: 15,
      name: "BBQ Shack",
      description: "Basic barbecue dishes",
      cuisine: "BBQ",
      cuisineType: "BBQ",
      priceRange: PriceRange.Moderate,
      rating: 3.5,
      averageRating: 3.5,
      reviewCount: 150,
      imageUrl: "/assets/images/restaurant15.jpg",
      address: "555 BBQ Street, Foodville",
      phoneNumber: "(555) 555-5555",
      website: "https://bbqshack.example.com",
      dietaryOptions: [],
      openingHours: ["Tuesday-Sunday: 11:00 AM - 9:00 PM", "Monday: Closed"],
      reviews: []
    },
    {
      id: 16,
      name: "Seafood Spot",
      description: "Basic seafood dishes",
      cuisine: "Seafood",
      cuisineType: "Seafood",
      priceRange: PriceRange.Moderate,
      rating: 3.8,
      averageRating: 3.8,
      reviewCount: 180,
      imageUrl: "/assets/images/restaurant16.jpg",
      address: "666 Ocean Drive, Foodville",
      phoneNumber: "(555) 666-6666",
      website: "https://seafoodspot.example.com",
      dietaryOptions: [],
      openingHours: ["Monday-Sunday: 11:00 AM - 10:00 PM"],
      reviews: []
    },
    {
      id: 17,
      name: "Diner Deluxe",
      description: "Classic American diner food",
      cuisine: "American",
      cuisineType: "American",
      priceRange: PriceRange.Budget,
      rating: 1.5,
      averageRating: 1.5,
      reviewCount: 60,
      imageUrl: "/assets/images/restaurant17.jpg",
      address: "777 Diner Lane, Foodville",
      phoneNumber: "(555) 777-7777",
      website: "https://dinerdeluxe.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 6:00 AM - 10:00 PM"],
      reviews: []
    },
    {
      id: 18,
      name: "Burger Joint",
      description: "Basic burger place",
      cuisine: "American",
      cuisineType: "American",
      priceRange: PriceRange.Budget,
      rating: 2.1,
      averageRating: 2.1,
      reviewCount: 85,
      imageUrl: "/assets/images/restaurant18.jpg",
      address: "888 Burger Road, Foodville",
      phoneNumber: "(555) 888-8888",
      website: "https://burgerjoint.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 11:00 AM - 11:00 PM"],
      reviews: []
    },
    {
      id: 19,
      name: "Sandwich Stop",
      description: "Basic sandwich shop",
      cuisine: "Sandwiches",
      cuisineType: "Sandwiches",
      priceRange: PriceRange.Budget,
      rating: 2.5,
      averageRating: 2.5,
      reviewCount: 95,
      imageUrl: "/assets/images/restaurant19.jpg",
      address: "999 Sandwich Street, Foodville",
      phoneNumber: "(555) 999-9999",
      website: "https://sandwichstop.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 8:00 AM - 8:00 PM"],
      reviews: []
    },
    {
      id: 20,
      name: "Ice Cream Parlor",
      description: "Basic ice cream shop",
      cuisine: "Dessert",
      cuisineType: "Dessert",
      priceRange: PriceRange.Budget,
      rating: 3.2,
      averageRating: 3.2,
      reviewCount: 110,
      imageUrl: "/assets/images/restaurant20.jpg",
      address: "1000 Sweet Street, Foodville",
      phoneNumber: "(555) 000-0000",
      website: "https://icecreamparlor.example.com",
      dietaryOptions: ["Vegetarian"],
      openingHours: ["Monday-Sunday: 12:00 PM - 10:00 PM"],
      reviews: []
    }
  ];

  constructor(private http: HttpClient) {
    this.initializeRestaurants();
    this.loadPersistedReviewsMap();
  }

  private initializeRestaurants(): void {
    // Set initial restaurants
    this.restaurants = [...this.initialRestaurants];
    this.restaurantsSubject.next(this.restaurants);

    // Extract and set unique cuisine types
    const uniqueCuisines = Array.from(new Set(this.restaurants.map(r => r.cuisine))).sort();
    this.cuisineTypesSubject.next(uniqueCuisines);

    // Initialize reviews map for each restaurant
    this.restaurants.forEach(restaurant => {
      this.reviewsMap.set(restaurant.id, []);
    });
  }

  getRestaurants(): Observable<Restaurant[]> {
    return of(this.restaurants).pipe(
      tap(restaurants => {
        this.restaurantsSubject.next(restaurants);
        const uniqueCuisines = Array.from(new Set(restaurants.map(r => r.cuisine))).sort();
        this.cuisineTypesSubject.next(uniqueCuisines);
      })
    );
  }

  getRestaurantById(id: number): Observable<Restaurant | undefined> {
    return of(this.restaurants.find(r => r.id === id));
  }

  searchRestaurants(
    searchTerm: string = '',
    cuisine: string = '',
    priceRange: string = '',
    rating: string = ''
  ): Observable<Restaurant[]> {
    return this.getRestaurants().pipe(
      map(restaurants => {
        return restaurants.filter(restaurant => {
          // Search term filter
          const matchesSearch = !searchTerm || 
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());

          // Cuisine filter
          const matchesCuisine = !cuisine || 
            restaurant.cuisineType.toLowerCase() === cuisine.toLowerCase();

          // Price range filter
          const matchesPriceRange = !priceRange || 
            restaurant.priceRange.toString() === priceRange;

          // Rating filter - now matches exact rating
          const matchesRating = !rating || 
            Math.floor(restaurant.averageRating) === parseInt(rating);

          return matchesSearch && matchesCuisine && matchesPriceRange && matchesRating;
        });
      })
    );
  }

  private persistReviewsMap(): void {
    try {
      const reviewsMapData: { [key: number]: Review[] } = {};
      this.reviewsMap.forEach((value, key) => {
        reviewsMapData[key] = value;
      });
      localStorage.setItem('restaurantReviews', JSON.stringify(reviewsMapData));
    } catch (error) {
      console.error('Error persisting reviews map:', error);
    }
  }

  private loadPersistedReviewsMap(): void {
    try {
      const persistedData = localStorage.getItem('restaurantReviews');
      if (persistedData) {
        const reviewsMapData = JSON.parse(persistedData);
        Object.keys(reviewsMapData).forEach(key => {
          const restaurantId = Number(key);
          const reviews = reviewsMapData[key].map((review: any) => ({
            ...review,
            createdAt: new Date(review.createdAt),
            updatedAt: review.updatedAt ? new Date(review.updatedAt) : null
          }));
          this.reviewsMap.set(restaurantId, reviews);
        });
      }
    } catch (error) {
      console.error('Error loading persisted reviews map:', error);
    }
  }

  getRestaurantReviews(restaurantId: number, page: number = 1, pageSize: number = 10): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${restaurantId}/reviews?page=${page}&pageSize=${pageSize}`, { withCredentials: true }).pipe(
      tap(reviews => {
        // Update the local reviews map
        const existingReviews = this.reviewsMap.get(restaurantId) || [];
        const updatedReviews = page === 1 ? reviews : [...existingReviews, ...reviews];
        this.reviewsMap.set(restaurantId, updatedReviews);
        this.persistReviewsMap();
      }),
      catchError(error => {
        console.warn('API not available, using cached data:', error);
        return of(this.reviewsMap.get(restaurantId) || []);
      })
    );
  }

  addReview(restaurantId: number, review: Review): Observable<Review> {
    // Get existing reviews for the restaurant
    const existingReviews = this.reviewsMap.get(restaurantId) || [];
    
    // Add the new review to the beginning of the array
    const updatedReviews = [review, ...existingReviews];
    this.reviewsMap.set(restaurantId, updatedReviews);
    this.persistReviewsMap();

    // Update the restaurant's review count and average rating
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      restaurant.reviews = updatedReviews;
      restaurant.reviewCount = updatedReviews.length;
      restaurant.averageRating = this.calculateAverageRating(updatedReviews);
      restaurant.rating = restaurant.averageRating;

      // Update the restaurants subject to trigger UI updates
      this.restaurantsSubject.next([...this.restaurants]);
    }

    return of(review);
  }

  private calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }

  updateRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    const index = this.restaurants.findIndex(r => r.id === restaurant.id);
    if (index !== -1) {
      this.restaurants[index] = restaurant;
      this.restaurantsSubject.next([...this.restaurants]);
    }
    return of(restaurant);
  }

  deleteReview(restaurantId: number, reviewId: number): void {
    // Get existing reviews for the restaurant
    const existingReviews = this.reviewsMap.get(restaurantId) || [];
    
    // Remove the review
    const updatedReviews = existingReviews.filter(review => review.id !== reviewId);
    this.reviewsMap.set(restaurantId, updatedReviews);
    this.persistReviewsMap();

    // Update the restaurant's review count and average rating
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      restaurant.reviews = updatedReviews;
      restaurant.reviewCount = updatedReviews.length;
      restaurant.averageRating = this.calculateAverageRating(updatedReviews);
      restaurant.rating = restaurant.averageRating;

      // Update the restaurants subject to trigger UI updates
      this.restaurantsSubject.next([...this.restaurants]);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    if (error.status === 401) {
      return throwError(() => new Error('Unauthorized'));
    }
    return throwError(() => new Error(error.error?.message || 'An error occurred'));
  }

  getRestaurant(id: number): Observable<RestaurantResponseDTO> {
    return this.http.get<RestaurantResponseDTO>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map(response => ({
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
        reviews: response.reviews.map(review => ({
          ...review,
          createdAt: new Date(review.createdAt),
          updatedAt: review.updatedAt ? new Date(review.updatedAt) : null
        }))
      }))
    );
  }
} 