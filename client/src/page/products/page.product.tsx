import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { BASE_URL } from "../../constant/appInfo";
import { Collection } from "../../models/Collections";
import { Products } from "../../models/Products";
import MenuCollection from "../../components/Product/MenuCollection";

export default function PageProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filter state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priceMax, setPriceMax] = useState<number>(0);
  const [priceCeil, setPriceCeil] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"latest" | "price-asc" | "price-desc">("latest");

  // fetch collection info + products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // collection info
        const colRes = await fetch(`${BASE_URL}/collections/${id}`);
        const colData = await colRes.json();
        setCollection(colData);

        // products in collection
        const prodRes = await fetch(`${BASE_URL}/products?collectionId=${id}&limit=100`);
        const prodData = await prodRes.json();

        if (prodData?.data) {
          setProducts(prodData.data);
          // --- FIX 1: Lấy giá gốc, không chia 100 ---
          const maxPrice = Math.max(...prodData.data.map((p: Products) => p.price));
          setPriceCeil(maxPrice || 0);
          setPriceMax(maxPrice || 0);
        } else {
          setProducts([]);
          setPriceCeil(0);
          setPriceMax(0);
        }
      } catch (e: any) {
        setError(e?.message || "Error loading products");
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (id) fetchData();
  }, [id]);

  // các loại type để hiển thị filter
  const types = useMemo(() => {
    const t = new Set<string>();
    products.forEach((p) => p.type && t.add(p.type));
    return Array.from(t);
  }, [products]);

  // lọc + sắp xếp
  const filtered = useMemo(() => {
    let list = products;

    if (search.trim()) {
      const key = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(key));
    }

    if (typeFilter !== "all") {
      list = list.filter((p) => p.type === typeFilter);
    }

    if (priceMax > 0) {
      // --- FIX 2: So sánh giá gốc, không chia 100 ---
      list = list.filter((p) => p.price <= priceMax);
    }

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else {
      list = [...list].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }

    return list;
  }, [products, search, typeFilter, priceMax, sortBy]);

  const handleAddToCart = (product: Products) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1,
        type: product.type || "",
      })
    );
  };

  if (loading) {
    return (
      <div className="px-20 py-16 text-center">
        <div className="loading loading-spinner loading-lg" />
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-20 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 py-10">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="pet-stock-text-color text-4xl font-semibold uppercase">
          {collection ? collection.name : "Collection"}
        </h1>
        <p className="text-gray-600">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <main className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar filter */}
        <div className="lg:col-span-1">
          <MenuCollection
            types={types}
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            priceMax={priceMax}
            priceCeil={priceCeil}
            onPriceChange={setPriceMax}
            onReset={() => {
              setSearch("");
              setTypeFilter("all");
              setPriceMax(priceCeil);
              setSortBy("latest");
            }}
          />
        </div>

        {/* Products list */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              Showing <strong>{filtered.length}</strong> items
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                className="select select-bordered select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="latest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border rounded-xl p-10 text-center shadow-sm">
              <p className="text-lg font-semibold mb-2">No products match your filters</p>
              <p className="text-gray-500 mb-4">Try adjusting search or price range.</p>
              <button className="btn btn-outline btn-sm" onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setPriceMax(priceCeil);
                setSortBy("latest");
              }}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="card bg-base-100 shadow-md border hover:shadow-xl transition">
                  <figure className="relative w-full h-56 bg-white rounded-t-xl p-4">
                    <Link to={`/products/${item.id}`} className="block w-full h-full">
                      <img src={item.imageUrl} alt={item.name} className="object-contain w-full h-full" />
                    </Link>
                  </figure>
                  <div className="card-body">
                    <Link to={`/products/${item.id}`}>
                      <h2 className="card-title text-base line-clamp-2 min-h-[3rem] hover:underline">
                        {item.name}
                      </h2>
                      <p className="py-2 text-2xl font-semibold">
                        ${item.price}
                      </p>
                      {item.type && <p className="badge badge-ghost">{item.type}</p>}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="btn mt-2 verify-supp-color text-white"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}