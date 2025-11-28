import { IPayment } from "./interface/payment";

export class StripeService implements IPayment {
    public async processPayment(amount: number, currency: string): Promise<boolean> {
        // Simulate Stripe payment processing logic
        console.log(`Processing Stripe payment of ${amount} ${currency}`);
        return Promise.resolve(true);
    }
}