import { User } from '../models/user.entity';

export type PublicUser = Pick<
  User,
  | 'id'
  | 'phone'
  | 'role'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'company_name'
  | 'amount_issued_cards'
  | 'country'
  | 'is_confirmed'
  | 'is_fulfilled'
  | 'os'
  | 'status'
>;
