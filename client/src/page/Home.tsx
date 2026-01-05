import BannerHome from "../components/BannerHome";
import { ProductsCardByCollection } from "../components/Product/ProductsCardByCollection";

const Home = () => {
  return (
    <div className="bg-base-100">
      {/* Hero / Banner */}
      <BannerHome />

      {/* Section intro */}
      <section className="px-6 lg:px-14 py-10">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-green-700">Verified Supplements</p>
          <h1 className="text-3xl lg:text-4xl font-bold     ">
            Get more for less with VerifySupp
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
              Curated products by collection, great prices and guaranteed quality. Fast shopping, fast delivery.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <a href="#collections" className="btn verify-supp-color text-white btn">View Collections</a>
            {/* <a href="/search" className="btn btn-outline btn-sm">Tìm kiếm</a> */}
          </div>
        </div>
      </section>

      {/* Highlight cards */}
      <section className="px-6 lg:px-14 pb-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-base-200 text-primary-content shadow-sm">
            <div className="card-body">
            <h3 className="card-title">Fast Delivery</h3>
            <p>Order today, receive as soon as possible.</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
            <h3 className="card-title">Authentic</h3>
            <p>Verified products with clear origin.</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
            <h3 className="card-title">Authentic</h3>
            <p>Verified products with clear origin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products by collection */}
      <section id="collections" className="px-6 lg:px-14 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold pet-stock-text-color">
            Collections & Products
            </h2>
            <a href="/search" className="text-sm text-primary hover:underline">
            View All
            </a>
          </div>
          <ProductsCardByCollection />
        </div>
      </section>
    </div>
  );
};

export default Home;