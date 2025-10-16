export interface AddressModel {
  address: string;
  additional_address?: string;
  city: string;
  zip: string;
  country: string; // ISO code (FR, US, etc.)
}