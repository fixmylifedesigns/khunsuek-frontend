import React from 'react';
import { ShoppingCart } from 'lucide-react';

const CartIcon = ({ cartItems }) => {
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {itemCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartIcon;