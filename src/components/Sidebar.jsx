import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const pathLocation = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({ produk: false });

  const handleSubmit = (e) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 2000);
  };

  useEffect(() => {
    if (pathLocation.pathname.startsWith("/product-")) {
      setOpenDropdown((prev) => ({ ...prev, produk: true }));
    }
  }, [pathLocation.pathname]);

  const toggleDropdown = (menu) => {
    setOpenDropdown((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <div className="d-flex flex-column bg-dark text-white h-100 justify-content-between">
      <div className="p-3">
        <Link
          to="/home"
          className="text-white link-offset-2 link-underline link-underline-opacity-0"
        >
          <h5 className="text-center h2 mb-3">MENU</h5>
        </Link>
        <hr className="text-white" />
        <ul className="fw-light h-full nav flex-column h5">
          {/* Home Menu */}
          <li className="nav-item py-2">
            <Link
              to="/home"
              className={`nav-link ${
                pathLocation.pathname === "/"
                  ? " bg-info-subtle text-black"
                  : "text-white"
              } hover-effect`}
            >
              Home
            </Link>
          </li>
          {/* Produk Menu */}
          <li className="nav-item py-2">
            <div
              className={`d-flex justify-content-between align-items-center nav-link hover-effect ${
                openDropdown.produk ? "text-white" : "text-white"
              }`}
              onClick={() => toggleDropdown("produk")}
              style={{ cursor: "pointer" }}
            >
              <span>Produk</span>
              <i
                className={`bi bi-chevron-${
                  openDropdown.produk ? "up" : "down"
                }`}
              ></i>
            </div>
            {openDropdown.produk && (
              <ul className="nav flex-column ms-4 gap-2">
                <li className="nav-item">
                  <Link
                    to="/product-all"
                    className={`nav-link py-[5px] ${
                      pathLocation.pathname === "/product-all"
                        ? " bg-info-subtle text-black"
                        : "text-white"
                    } hover-effect`}
                  >
                    Semua Produk
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/product-recommendation"
                    className={`nav-link ${
                      pathLocation.pathname === "/product-recommendation"
                        ? " bg-info-subtle text-black"
                        : "text-white"
                    } hover-effect`}
                  >
                    Saran Produk
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/product-clasification"
                    className={`nav-link ${
                      pathLocation.pathname === "/product-clasification"
                        ? " bg-info-subtle text-black"
                        : "text-white"
                    } hover-effect`}
                  >
                    Klasifikasi Produk
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/product-performance"
                    className={`nav-link ${
                      pathLocation.pathname === "/product-performance"
                        ? " bg-info-subtle text-black"
                        : "text-white"
                    } hover-effect`}
                  >
                    Peforma Produk
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/product-ads-all"
                    className={`nav-link ${
                      pathLocation.pathname === "/product-ads-all"
                        ? " bg-info-subtle text-black"
                        : "text-white"
                    } hover-effect`}
                  >
                    Iklan Produk
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item py-2">
            <Link
              to="/merchant"
              className={`nav-link ${
                pathLocation.pathname === "/merchant"
                  ? " bg-info-subtle text-black"
                  : "text-white"
              } hover-effect`}
            >
              Merchant
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-3">
            <button
              type="submit"
              className="btn btn-danger w-100 fw-medium"
              style={{ color: "white" }}
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden ">Loading...</span>
                </div>
              ) : (
                "Sign Out"
              )}
            </button>
          </div>
    </div>
  );
};

export default Sidebar;