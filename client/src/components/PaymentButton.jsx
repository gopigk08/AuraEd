import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const PaymentButton = ({ course, user, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!user) {
            toast.error('Please login to purchase');
            return;
        }

        setLoading(true);
        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load');
                return;
            }

            // 1. Create Order
            const { data: order } = await api.post('/payment/create-order', {
                courseId: course._id,
                userId: user.uid
            });

            // 2. Configure Razorpay
            const options = {
                key: "rzp_test_SE3m6JnU8ePzOg", // Replace with env variable in real app
                amount: order.amount,
                currency: order.currency,
                name: "AuraEd",
                description: `Purchase ${course.title}`,
                image: "https://your-logo-url.com/logo.png", // Optional
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await api.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: course._id,
                            userId: user.uid
                        });

                        toast.success('Enrolled Successfully!');
                        if (onSuccess) onSuccess();
                    } catch (error) {
                        toast.error('Payment Verification Failed');
                        console.error(error);
                    }
                },
                prefill: {
                    name: user.name || "AuraEd User",
                    email: user.email || "user@example.com",
                    contact: "9876543210" // Standard 10-digit dummy number
                },
                theme: {
                    color: "#6366f1"
                }
            };

            // 4. Open Checkout
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                toast.error(response.error.description || "Payment Failed");
            });
            rzp1.open();

        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Something went wrong';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem', minWidth: '150px' }}
        >
            {loading ? 'Processing...' : 'Buy Now'}
        </button>
    );
};

export default PaymentButton;
