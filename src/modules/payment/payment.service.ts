import { IPayment } from "./interface/payment";
import { IPaymentProcessor, PaymentType } from "./interface/processor";
import { PaypalService } from "./paypal.service";
import { StripeService } from "./stripe.service";

export class PaymentService implements IPaymentProcessor {
    public getPaymentProcessor(type:PaymentType): IPayment {
        switch(type) {
            case 'Stripe':
                return new StripeService();
            case 'PayPal':
                return new PaypalService();
            default:
                throw new Error('Unsupported payment type');
        }
    }

}