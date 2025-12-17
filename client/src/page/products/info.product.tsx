import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import OptionNearYou from "../../components/Product/OptionNearYou";
import { BASE_URL } from "../../constant/appInfo.ts";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice.ts";
import { Products } from "../../models/Products.ts";

export default function ProductInforPage() {
  const [productDetail, setProductDetail] = useState<Products | null>(null);
  const [deliverOne, setDeliverOne] = useState(false);
  const [autoShip, setAutoShip] = useState(false);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getProductsDetail = async () => {
      try {
        const api = `/products/${id}`;
        const res = await fetch(BASE_URL + api);
        const data = await res.json();
        setProductDetail(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    getProductsDetail();
  }, [id]);

  useEffect(() => {
    if (deliverOne) setAutoShip(false);
    if (autoShip) setDeliverOne(false);
  }, [deliverOne, autoShip]);

  const addToCartHandler = () => {
    if (!productDetail) return;
    dispatch(
      addToCart({
        name: productDetail.name,
        imageUrl: productDetail.imageUrl,
        price: Number(productDetail.price),
        type: productDetail.type,
        qty,
        id: productDetail.id,
      })
    );
  };

  if (loading) {
    return <div className="px-20 py-10 text-lg">Loading product...</div>;
  }

  if (!productDetail) {
    return <div className="px-20 py-10 text-lg text-red-500">Product not found.</div>;
  }

  return (
    <div className="px-20 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="pet-stock-text-color text-4xl font-semibold">{productDetail.name}</p>
          <p className="text-gray-500 mt-2">Type: {productDetail.type}</p>
        </div>
        <div className="badge badge-lg badge-outline border-2 pet-stock-border-color text-sm">
          Collection
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Image */}
        <div className="lg:col-span-1 border border-slate-200 rounded-xl bg-white p-3">
          <figure className="aspect-square flex items-center justify-center">
            <img
              src={productDetail.imageUrl}
              alt={productDetail.name}
              className="object-contain max-h-full"
            />
          </figure>
        </div>

{/* Middle: Info */}
<div className="lg:col-span-2 border border-slate-200 rounded-xl bg-white p-6 space-y-6">
  {/* Giá + tồn + badge */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div className="flex items-center gap-3">
      <span className="text-3xl font-bold pet-stock-text-color">
        ${Number(productDetail.price)}
      </span>
      <span
        className={`badge badge-lg ${
          productDetail.countInStock > 0 ? "badge-success" : "badge-error"
        }`}
      >
        {productDetail.countInStock > 0 ? "In Stock" : "Out of Stock"}
      </span>
    </div>
    <div className="text-sm text-gray-500 flex items-center gap-3">
      <span className="px-3 py-1 rounded-full bg-zinc-100">Free returns 30d</span>
      <span className="px-3 py-1 rounded-full bg-zinc-100">Ships in 24h</span>
    </div>
  </div>

  <div className="divider my-0" />

  {/* Thông tin chi tiết ngắn gọn */}
  <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
    {/* <div className="flex items-start gap-2 p-3 rounded-lg bg-zinc-50">
      <span className="font-semibold">Type:</span>
      <span className="text-gray-700">{productDetail.type}</span>
    </div> */}
    <div className="flex items-start gap-2 p-3 rounded-lg bg-zinc-50">
      <span className="font-semibold">Ingredients:</span>
      <span className="text-gray-700">{productDetail.ingredient}</span>
    </div>
    {productDetail.reviews && (
      <div className="md:col-span-2 flex items-start gap-2 p-3 rounded-lg bg-zinc-50">
        <span className="font-semibold">Reviews:</span>
        <span className="text-gray-700">{productDetail.reviews}</span>
      </div>
    )}
  </div>

  <div className="divider my-0" />

  {/* Quantity + Add to cart */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Quantity</span>
      <div className="border-2 border-slate-200 rounded-lg flex items-center w-36">
        <button
          className="flex-1 py-2 flex justify-center items-center hover:bg-gray-100"
          onClick={() => setQty((prev) => (prev === 1 ? 1 : prev - 1))}
        >
          <IoMdRemove />
        </button>
        <div className="w-12 text-center font-semibold">{qty}</div>
        <button
          className="flex-1 py-2 flex justify-center items-center hover:bg-gray-100"
          onClick={() => setQty((prev) => prev + 1)}
        >
          <IoMdAdd />
        </button>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button
        className="btn btn-neutral h-12 border-2 border-slate-200 rounded-lg pet-stock-color text-white px-6"
        onClick={addToCartHandler}
        disabled={productDetail.countInStock <= 0}
      >
        ADD TO CART
      </button>
      <div className="text-sm text-gray-500">
        {productDetail.countInStock} item(s) available
      </div>
    </div>
  </div>
</div>

        {/* Right: Extra options */}
        <div className="lg:col-span-1">
          <OptionNearYou />
        </div>
      </main>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 border rounded-xl p-8">
        <div>
          <p className="pet-stock-text-color text-2xl font-semibold mb-3 text-center">Description</p>
          <p className="text-center text-gray-700">{productDetail.description}</p>
        </div>
        <div>
          <p className="pet-stock-text-color text-2xl font-semibold mb-3 text-center">Ingredients</p>
          <p className="text-center text-gray-700">{productDetail.ingredient}</p>
        </div>
        <div>
          <p className="pet-stock-text-color text-2xl font-semibold mb-3 text-center">Reviews</p>
          <p className="text-center text-gray-700">{productDetail.reviews || "No reviews yet."}</p>
        </div>
      </div>
    </div>
  );
}