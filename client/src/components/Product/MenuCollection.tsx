type MenuCollectionProps = {
  types: string[];
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  priceMax: number;
  priceCeil: number;
  onPriceChange: (v: number) => void;
  onReset: () => void;
};

export default function MenuCollection({
  types,
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  priceMax,
  priceCeil,
  onPriceChange,
  onReset,
}: MenuCollectionProps) {
  return (
    <div className="bg-base-200 rounded-xl p-4 space-y-4 border shadow-sm">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Search</span>
        </label>
        <input
          type="text"
          placeholder="Search products..."
          className="input input-bordered input-sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="divider my-2" />

      <div>
        <p className="font-semibold mb-2">Type</p>
        <div className="space-y-2 max-h-52 overflow-auto pr-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type-filter"
              className="radio radio-sm radio-primary"
              checked={typeFilter === "all"}
              onChange={() => onTypeChange("all")}
            />
            <span className="text-sm">All</span>
          </label>
          {types.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type-filter"
                className="radio radio-sm radio-primary"
                checked={typeFilter === t}
                onChange={() => onTypeChange(t)}
              />
              <span className="text-sm">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="divider my-2" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold">Price (max)</p>
          <span className="text-sm text-gray-600">${priceMax.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(priceCeil, 0)}
          value={priceMax}
          step={1}
          className="range range-primary"
          onChange={(e) => onPriceChange(Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>$0</span>
          <span>${Math.max(priceCeil, 0).toFixed(2)}</span>
        </div>
      </div>

      <button className="btn btn-outline btn-sm w-full" onClick={onReset}>
        Reset filters
      </button>
    </div>
  );
}