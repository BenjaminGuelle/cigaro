import { AddressModel } from '../../models';

export interface CreateUserRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  pseudo: string; // Required pour register classique
  address?: AddressModel;
}