"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { checkoutCart, verifyPayment, markPaymentFailed } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.discount_price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      onClose();
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await checkoutCart();
      const order = response.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Vilix",
        description: "Cart Checkout",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
            });
            // Payment verified!
            await clearCart();
            onClose();
            router.push("/orders"); // Or wherever we want
          } catch (err) {
            console.error("Verification failed!", err);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", async function (response: any) {
        try {
          await markPaymentFailed({ orderId: response.error.metadata.order_id });
        } catch (e) {
          console.error("Failed to mark payment as failed", e);
        }
      });
      rzp.open();
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0a0a0a] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-light tracking-[0.2em] uppercase text-white">Your Cart</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close Cart"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <p className="text-sm font-light tracking-[0.1em] uppercase">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product_id} className="flex gap-6">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-white/5 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-medium text-white tracking-wide line-clamp-2 pr-4">
                          {item.product_name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-500 hover:text-red-400 transition-colors mt-0.5"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="text-sm font-light text-gray-400 mb-4">
                        ₹{item.discount_price.toLocaleString('en-IN')}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex items-center gap-3 border border-white/20 rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white text-xs font-medium tabular-nums w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-base font-medium text-white tracking-wider">
                          ₹{(item.discount_price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Area */}
            <div className="mt-auto">
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-gray-400 uppercase tracking-[0.1em]">Subtotal</span>
                    <span className="text-xl text-white tracking-widest font-light">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 font-light">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-white text-black py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-gray-200 transition-colors rounded-sm flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </button>
                </div>
              )}
              {isAuthenticated && (
                <div className="p-5 border-t border-white/10 bg-[#050505] backdrop-blur-md">
                  <Link 
                    href="/orders" 
                    onClick={onClose} 
                    className="block w-full text-center text-gray-400 hover:text-white text-[10px] uppercase tracking-[0.3em] transition-colors"
                  >
                    View Order History
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
