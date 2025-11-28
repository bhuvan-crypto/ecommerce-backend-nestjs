import { IPayment } from "./interface/payment";

export class PaypalService implements IPayment {
    public async processPayment(amount: number, currency: string): Promise<boolean> {
        // Simulate PayPal payment processing logic
        console.log(`Processing PayPal payment of ${amount} ${currency}`);
        return Promise.resolve(true);
    }
}