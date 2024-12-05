import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="d-flex flex-column" style={{ width: "200px", padding: "20px" }}>
      <ul className="list-unstyled">
        <li>
          <Link className="text-decoration-none" to="/">Home</Link>
        </li>
        <li>
          <Link className="text-decoration-none" to="/about">About</Link>
        </li>
        <li>
          <Link className="text-decoration-none" to="/contact">Contact</Link>
        </li>
       
      </ul>
    </div>
  );
}

export default Sidebar;