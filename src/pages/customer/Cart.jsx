import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';
import { placeOrder } from '../../api/customer.api';
import { createPaymentOrder, verifyPayment } from '../../api/payment.api'; // ✅ NEW
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const DELIVERY_FEE = 20;

// ✅ Loads the Razorpay checkout script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart, cartTotal } = useCart();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cart.items.length === 0) {
    return <EmptyState icon={ShoppingCart} message={t('customer.cart_empty')} actionLabel={t('customer.browse_vendors')} onAction={() => navigate('/customer')} />;
  }

  const totalAmount = cartTotal + DELIVERY_FEE;

  // ✅ NEW: Handles the full Razorpay payment flow
  const handlePayWithRazorpay = async () => {
    if (!address.trim()) {
      setError('Delivery address is required');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Load the Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 2: Create a Razorpay order on the backend
      const { data } = await createPaymentOrder(totalAmount);
      const { order_id, amount, currency, key } = data;

      // Step 3: Open the Razorpay checkout popup
      const options = {
        key,               // Razorpay Key ID (safe to use in frontend)
        amount,            // In paise
        currency,
        order_id,
        name: 'StreetConnect',
        description: `Order from ${cart.vendorName}`,
        // ✅ Step 4: On successful payment, verify + place the order
        handler: async (response) => {
          try {
            // Verify the payment signature on the backend
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.data.success) {
              toast.error('Payment verification failed. Please contact support.');
              setLoading(false);
              return;
            }

            // Payment verified ✅ — now place the order in the database
            await placeOrder({
              vendor_id: cart.vendorId,
              items: cart.items.map(i => ({
                menu_item_id: i.menuItemId,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
              })),
              total_amount: totalAmount,
              delivery_address: address,
              payment_id: verifyRes.data.payment_id,  // Store payment reference
            });

            clearCart();
            toast.success('Payment successful! Order placed 🎉');
            navigate('/customer/orders');
          } catch (err) {
            toast.error('Order placement failed after payment. Please contact support with payment ID: ' + response.razorpay_payment_id);
            setLoading(false);
          }
        },
        // ✅ Step 5: Handle payment modal close / failure
        modal: {
          ondismiss: () => {
            toast('Payment cancelled.', { icon: 'ℹ️' });
            setLoading(false);
          },
        },
        prefill: {
          // These fields auto-fill the Razorpay form for the user
          name: '',   // You can pass user's name here if available
          email: '',  // You can pass user's email here if available
        },
        theme: {
          color: '#f97316', // Matches StreetConnect's primary orange color
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // Handle payment failure (e.g., card declined)
      razorpayInstance.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpayInstance.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-4 pb-20 md:pb-8 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-1">{t('customer.cart')}</h1>
      <p className="text-sm text-text-secondary mb-4">{cart.vendorName}</p>

      <div className="space-y-3 mb-6">
        {cart.items.map(item => (
          <div key={item.menuItemId} className="bg-white rounded-card border border-surface-border shadow-card p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-primary font-semibold text-sm">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface-bg rounded-btn">
                <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="p-2"><Minus size={16} /></button>
                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} className="p-2"><Plus size={16} /></button>
              </div>
              <button onClick={() => removeItem(item.menuItemId)} className="p-2 text-error"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t('customer.delivery_address')}</label>
        <textarea value={address} onChange={e => { setAddress(e.target.value); setError(''); }}
          rows={2} className="w-full px-3 py-3 border border-surface-border rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>

      <div className="bg-white rounded-card border border-surface-border shadow-card p-4 space-y-2 mb-4">
        <div className="flex justify-between text-sm"><span>{t('customer.subtotal')}</span><span>₹{cartTotal}</span></div>
        <div className="flex justify-between text-sm"><span>{t('customer.delivery_fee')}</span><span>₹{DELIVERY_FEE}</span></div>
        <div className="border-t border-surface-border pt-2 flex justify-between font-semibold"><span>{t('customer.total')}</span><span>₹{cartTotal + DELIVERY_FEE}</span></div>
      </div>

      {/* ✅ NEW: Pay with Razorpay button (replaces old "place order" button) */}
      <button
        onClick={handlePayWithRazorpay}
        disabled={loading}
        className="w-full bg-primary text-white py-4 rounded-btn font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            🔒 Pay ₹{totalAmount} with Razorpay
          </>
        )}
      </button>

      <p className="text-center text-xs text-text-secondary mt-2">Secured by Razorpay</p>
    </div>
  );
};

export default Cart;
