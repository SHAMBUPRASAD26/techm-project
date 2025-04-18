export interface AuthResponseDTO {
  token: string;
  username: string;
  email: string;
  id: number;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt?: Date;
  reviewCount?: number;
  averageRating?: number;
} 