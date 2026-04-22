function Navbar({ setSidebarOpen }) {
  return (
    <div className="navbar">
      <button className="menu-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
        ☰
      </button>
      <div className="navbar-title">Restaurant Food Ordering System</div>
    </div>
  );
}

export default Navbar;