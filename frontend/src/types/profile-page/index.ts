export interface ProfileFormData {
  name: string;
  surname: string;
  username: string;
  email: string;
  password?: string;
  birthDate: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  country: string;
}

export interface UserProfileResponse {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  country: string;
  profilePictureUrl?: string;
  // ... otros campos que vengan del backend
}