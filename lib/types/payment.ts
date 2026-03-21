// Add these to lib/api/payment.ts — replace the existing MyTransactionsResponse

export interface TransactionOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  amount: string;
  currency: string;
  status: string;
}

export interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  amount: string;
  paystackReference: string;
  status: string;
  authorizationUrl: string | null;
  order: TransactionOrder;
}

export interface MyTransactionsResponse {
  success: boolean;
  message: string;
  data: Transaction[] | { data: Transaction[] };
  description?: string;
  status: number;
}