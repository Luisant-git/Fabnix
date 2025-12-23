import React, { useContext } from "react";
import { CompareContext } from "../contexts/CompareContext";
import { useNavigate } from "react-router-dom";

const MAX_COLUMNS = 3;

const ComparePage = () => {
  const { compare, remove, clear } = useContext(CompareContext);
  const navigate = useNavigate();

  const allEqual = (key) => {
    if (compare.length <= 1) return true;
    const vals = compare.map((c) => {
      switch (key) {
        case "price":
          return c.basePrice;
        case "brand":
          return c.brand?.name || "";
        case "category":
          return c.category?.name || "";
        case "colors":
          return (c.colors || []).map((x) => x.name).join(",");
        case "tags":
          return Array.isArray(c.tags) ? c.tags.join(",") : "";
        case "description":
          return c.description || "";
        case "name":
          return c.name || "";
        default:
          return "";
      }
    });
    return vals.every((v) => v === vals[0]);
  };

  return (
    <div className="compare-page">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h1>Compare Products</h1>
        </div>

        <div
          className="compare-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `220px repeat(${MAX_COLUMNS}, 1fr)`,
            gap: 16,
            alignItems: "start",
          }}
        >
          <div className="compare-keys" style={{ background: "transparent" }}>
            <div style={{ height: 260 }} />
            <div className="compare-key">Image</div>
            <div className="compare-key">Name</div>
            <div className="compare-key">Price</div>
            <div className="compare-key">Brand</div>
            <div className="compare-key">Category</div>
            <div className="compare-key">Sub Category</div>
            <div className="compare-key">Colors</div>
            <div className="compare-key">Description</div>
          </div>

          {Array.from({ length: MAX_COLUMNS }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="compare-col"
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 12,
                minHeight: 480,
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              {compare[colIdx] ? (
                <>
                  <button
                    className="remove-btn"
                    onClick={() => remove(compare[colIdx].id)}
                    title="Remove"
                    aria-label="Remove product"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="#f44336"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    className="product-card clickable"
                    onClick={() =>
                      navigate(
                        `/product/${encodeURIComponent(compare[colIdx].name)}/${
                          compare[colIdx].id
                        }`
                      )
                    }
                  >
                    <div
                      className="product-image-container"
                      style={{
                        height: 260,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fbfbfb",
                        borderRadius: 6,
                      }}
                    >
                      <img
                        src={
                          compare[colIdx].gallery?.[0]?.url ||
                          compare[colIdx].colors?.[0]?.image
                        }
                        alt={compare[colIdx].name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                    <div className="product-info" style={{ padding: "8px 0" }}>
                      <h3
                        className="product-name"
                        style={{ fontSize: 16, margin: 0, minHeight: 36 }}
                      >
                        {compare[colIdx].name}
                      </h3>
                      <div
                        style={{
                          marginTop: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {compare[colIdx].mrp && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                              fontSize: "0.9rem",
                            }}
                          >
                            ₹{compare[colIdx].mrp}
                          </span>
                        )}
                        <div style={{ color: "#f44336", fontWeight: 700 }}>
                          ₹{compare[colIdx].basePrice}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`compare-val ${!allEqual("name") ? "diff" : ""}`}
                    style={{ padding: "12px 8px" }}
                  >
                    {compare[colIdx].name}
                  </div>
                  <div
                    className={`compare-val ${
                      !allEqual("price") ? "diff" : ""
                    }`}
                    style={{ padding: "12px 8px" }}
                  >
                    ₹{compare[colIdx].basePrice}
                  </div>
                  <div
                    className={`compare-val ${
                      !allEqual("brand") ? "diff" : ""
                    }`}
                    style={{ padding: "12px 8px" }}
                  >
                    {compare[colIdx].brand?.name || "-"}
                  </div>
                  <div
                    className={`compare-val ${
                      !allEqual("category") ? "diff" : ""
                    }`}
                    style={{ padding: "12px 8px" }}
                  >
                    {compare[colIdx].category?.name || "-"}
                  </div>
                  <div
                    className={`compare-val ${
                      !allEqual("subCategory") ? "diff" : ""
                    }`}
                    style={{ padding: "12px 8px" }}
                  >
                    {compare[colIdx].subCategory?.name || "-"}
                  </div>
                  <div
                    className={`compare-val ${
                      !allEqual("colors") ? "diff" : ""
                    }`}
                    style={{ padding: "12px 8px" }}
                  >
                    {compare[colIdx].colors
                      ? compare[colIdx].colors.map((c) => c.name).join(", ")
                      : "-"}
                  </div>
                
                  <div
                    className={`compare-val ${
                      !allEqual("description") ? "diff" : ""
                    }`}
                    style={{ padding: "12px 8px" }}
                  >
                    {compare[colIdx].description
                      ? compare[colIdx].description.slice(0, 160) +
                        (compare[colIdx].description.length > 160 ? "..." : "")
                      : "-"}
                  </div>
                </>
              ) : (
                <div
                  className="compare-empty"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                    color: "#888",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 220,
                      border: "2px dashed #eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      background: "#fafafa",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>＋</div>
                      <div style={{ fontSize: 14 }}>Empty</div>
                    </div>
                  </div>
                  <button className="btn" onClick={() => navigate("/search")}>
                    Add from Catalog
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <style>{`
                    .btn { padding: 8px 12px; background: #1976d2; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
                    .btn.danger { background: #f44336; }
                    .remove-btn { position:absolute; top:8px; right:8px; background:#fff; border:1px solid rgba(244,67,54,0.12); color:#f44336; border-radius:50%; width:36px; height:36px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 6px rgba(0,0,0,0.06); z-index:50; }
                    .remove-btn svg { display:block; }

                    /* Use identical grid rows for keys and values so each label and value aligns horizontally */
                    .compare-keys, .compare-col { display: grid; grid-template-rows: 260px repeat(8, minmax(56px, auto)); }
                    .compare-key, .compare-val { padding: 12px 8px; font-weight:600; color:#333; border-bottom: 1px solid #f3f3f3; display:flex; align-items:center; }
                    .compare-key { font-weight:700; }
                    .compare-val { text-align:left; }
                    .compare-val.diff { background: transparent; border-left: none; }
                    .product-card.clickable { cursor: pointer; }
                    @media (max-width: 1000px) {
                        .compare-grid { grid-template-columns: 1fr !important; }
                        .compare-keys { display:none; }
                        .compare-col { padding:12px !important; grid-template-rows: none; }
                        .compare-key { display:none; }
                    }
                `}</style>
      </div>
    </div>
  );
};

export default ComparePage;
