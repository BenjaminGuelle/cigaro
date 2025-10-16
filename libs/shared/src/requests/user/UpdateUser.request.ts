import { AddressModel } from '../../models';
import { PrivacySettingsModel } from '../../models';

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  pseudo?: string;
  address?: AddressModel;
  privacySettings?: PrivacySettingsModel;
}