import React from 'react'
function MenuCollection() {
  return (
    <ul className="w-62 menu rounded-box bg-base-200">
      <li>
        <details>
          <summary>Brand</summary>
          <div className="form-control px-3">
            <label className="label cursor-pointer justify-start ">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Acana</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Adaptil</span>
            </label>
          </div>
        </details>
        <details>
          <summary>Animal Type</summary>
          <div className="form-control px-3">
            <label className="label cursor-pointer justify-start ">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Canine</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Feline</span>
            </label>
          </div>
        </details>
        <details>
          <summary>Price</summary>
          <input
            type="range"
            min={0}
            max="100"
            className="range range-primary"
          />{" "}
        </details>
        <details>
          <summary>Life Stage</summary>
          <div className="form-control px-3">
            <label className="label cursor-pointer justify-start ">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">All</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Adult</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Puppy</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Senior</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Kitten</span>
            </label>
          </div>
        </details>
        <details>
          <summary>Food Type</summary>
          <div className="form-control px-3">
            <label className="label cursor-pointer justify-start ">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Dry Food</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Wet Food</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Seasonal</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">RAW</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Canned Food</span>
            </label>
          </div>
        </details>
        <details>
          <summary>Type</summary>
          <div className="form-control px-3">
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Seasonal</span>
            </label>

            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Wet Food</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Canned Food</span>
            </label>
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">N/A</span>
            </label>

            <label className="label cursor-pointer justify-start ">
              <input type="checkbox" className="checkbox-info checkbox" />
              <span className="pl-3">Dry Food</span>
            </label>
          </div>
        </details>
      </li>
    </ul>
  );
}

export default MenuCollection;
