export interface RestaurantResponseDTO {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  cuisineType: string;
  priceRange: number;
  rating: number;
  averageRating: number;
  reviewCount: number;
  imageUrl: string;
  address: string;
  phoneNumber: string;
  website: string;
  dietaryOptions: string[];
  openingHours: string[];
  reviews: {
    id: number;
    rating: number;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;
    userId: number;
    username: string;
  }[];
  createdAt: Date;
  updatedAt: Date | null;
} 