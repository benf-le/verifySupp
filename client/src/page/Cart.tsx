import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { decreaseQty, increaseQty, removeFromCart } from "../redux/cartSlice";

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  window.scrollTo(0, 0);

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + (item.price / 100) * item.qty, 0).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className="px-6 py-16">
        <div className="max-w-3xl mx-auto bg-white shadow-sm border rounded-xl p-10 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-3xl font-semibold mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Explore our products and add items to your cart.
          </p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-14 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left: Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold pet-stock-text-color">Your Shopping Cart</h1>
            <span className="badge badge-lg badge-primary">{cart.length} items</span>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl shadow-sm p-4 flex gap-4"
              >
                <div className="w-28 h-28 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-lg line-clamp-2">{item.name}</p>
                      <p className="text-gray-600 mt-1">${(item.price / 100).toFixed(2)}</p>
                    </div>
                    <button
                      className="text-sm text-red-500 hover:underline"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="join border rounded-lg">
                      <button
                        className="join-item btn btn-ghost btn-sm"
                        onClick={() => dispatch(decreaseQty(item.id))}
                      >
                        -
                      </button>
                      <div className="join-item px-3 py-2 text-sm font-semibold">
                        {item.qty}
                      </div>
                      <button
                        className="join-item btn btn-ghost btn-sm"
                        onClick={() => dispatch(increaseQty(item.id))}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Total:{" "}
                      <span className="font-semibold">
                        ${((item.price / 100) * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div>
          <div className="bg-white border rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-semibold pet-stock-text-color mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery</span>
                <span className="text-gray-500">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Coupon</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold pet-stock-text-color">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>

            <Link to="/checkout">
              <button className="btn btn-primary w-full h-12 mt-6">
                Proceed to Checkout
              </button>
            </Link>

            <Link to="/" className="btn btn-ghost w-full h-12 mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}