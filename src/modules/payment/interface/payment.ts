export interface IPayment {
    processPayment(amount: number, currency: string): Promise<boolean>;
}