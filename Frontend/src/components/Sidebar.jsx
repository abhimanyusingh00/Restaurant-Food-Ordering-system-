import { Link, useLocation } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/customers", label: "Customers" },
    { path: "/restaurants", label: "Restaurants" },
    { path: "/categories", label: "Categories" },
    { path: "/menu-items", label: "Menu Items" },
    { path: "/orders", label: "Orders" },
    { path: "/order-items", label: "Order Items" },
    { path: "/payments", label: "Payments" },
    { path: "/delivery-agents", label: "Delivery Agents" },
    { path: "/reviews", label: "Reviews" },
    { path: "/coupons", label: "Coupons" },
    { path: "/queries", label: "Queries" },
    { path: "/analytics", label: "Analytics" },
  ];

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-title">Menu</div>
      <ul className="sidebar-links">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="sidebar-link"
              onClick={() => {
                if (window.innerWidth <= 900) setSidebarOpen(false);
              }}
              style={{
                background:
                  location.pathname === link.path
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                color:
                  location.pathname === link.path ? "#ffffff" : "#e5e7eb",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;