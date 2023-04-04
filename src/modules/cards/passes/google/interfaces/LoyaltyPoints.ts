export interface LoyaltyPoints {
  label: string;
  balance: {
    int?: number;
    string?: string;
    double?: number;
    money?: number;
  };
}
