"use client"

import React, { useState } from "react";

type Product = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  sale?: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Dining Chair",
    subtitle: "Simply dummy text of the printing",
    price: 60,
    oldPrice: 100,
    rating: 3,
    image: "/assets/images/product/p1.png",
    sale: true,
  },
  {
    id: "2",
    title: "Occasional Chair",
    subtitle: "Simply dummy text of the printing",
    price: 50,
    oldPrice: 80,
    rating: 4,
    image: "/assets/images/product/p2.png",
  },
  {
    id: "3",
    title: "Ceiling Light",
    subtitle: "Simply dummy text of the printing",
    price: 55,
    oldPrice: 90,
    rating: 5,
    image: "/assets/images/product/p3.png",
  },
  // 👉 add more fake products as needed
];

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="row ad-btm-space">
      {/* SIDEBAR */}
      <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12">
        <aside className="int-blog-sidebar">
          {/* SEARCH */}
          <div className="int-sidebar-box">
            <h4>Search</h4>
            <div className="input-group">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="button">🔍</button>
            </div>
          </div>

          {/* CATEGORY (STATIC FOR NOW) */}
          <div className="int-sidebar-box">
            <h4>Category</h4>
            <ul className="int-blog-category-mini">
              <li>Tables <span>201</span></li>
              <li>Sofas & Chairs <span>389</span></li>
              <li>Decoration <span>59</span></li>
              <li>Outdoor Furniture <span>653</span></li>
            </ul>
          </div>

          {/* DISCOUNT (UI ONLY) */}
          <div className="int-sidebar-box">
            <h4>Discount</h4>
            <label><input type="checkbox" /> 20% or more</label><br />
            <label><input type="checkbox" /> 50% or more</label>
          </div>
        </aside>
      </div>

      {/* PRODUCTS GRID */}
      <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12">
        <div className="main-product-grid">
          <ul>
            {PRODUCTS.map((product) => (
              <li key={product.id}>
                <div className="product-grid">
                  <div className="product-item">
                    <img src={product.image} alt={product.title} />

                    {product.sale && (
                      <div className="product-overlay">
                        <h4>sale</h4>
                      </div>
                    )}

                    <div className="product-ovr-links">
                      <ul>
                        <li>
                          <button onClick={() => console.log("Add to cart", product.id)}>
                            🛒
                          </button>
                        </li>
                        <li>
                          <button onClick={() => console.log("View", product.id)}>
                            🔍
                          </button>
                        </li>
                        <li>
                          <button onClick={() => console.log("Wishlist", product.id)}>
                            ❤️
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="product-text-rs">
                    <div>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`fa fa-star${i < product.rating ? "" : "-o"}`}
                        />
                      ))}
                    </div>

                    <h3>{product.title}</h3>
                    <h6>{product.subtitle}</h6>

                    <p>
                      {product.oldPrice && <span>${product.oldPrice} </span>}
                      ${product.price}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* PAGINATION (STATIC) */}
        <div className="card-footer pt-0">
          <ul className="pagination">
            <li className="page-item disabled">
              <button className="page-link">‹</button>
            </li>
            <li className="page-item active">
              <button className="page-link">1</button>
            </li>
            <li className="page-item">
              <button className="page-link">2</button>
            </li>
            <li className="page-item">
              <button className="page-link">3</button>
            </li>
            <li className="page-item">
              <button className="page-link">›</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
