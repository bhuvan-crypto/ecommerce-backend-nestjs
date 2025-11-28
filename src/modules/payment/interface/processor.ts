import { IPayment } from "./payment";

export type PaymentType = 'Stripe' | 'PayPal' | 'Square';

export interface IPaymentProcessor {
    getPaymentProcessor: (type: PaymentType) => IPayment;
}

export const PAYMENT_PROCESSOR_TOKEN = 'IPaymentProcessor';