import { Cigar as PrismaCigar, User, Tasting, CigarAward } from '@prisma/client';

export type CigarModel = PrismaCigar;

export interface CigarWithRelations extends CigarModel {
  creator?: User | null;
  verifier?: User | null;
  tastings?: Tasting[];
  awards?: CigarAward[];
}