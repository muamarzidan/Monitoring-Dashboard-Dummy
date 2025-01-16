import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="d-flex flex-column bg-dark text-white vh-100" style={{ width: '300px' }}>
            <div className="p-3">
                <h5 className="text-center h2 pb-1">MENU</h5>
                <hr className="text-white" />
                <ul className="nav flex-column h5">
                    <li className="nav-item py-2">
                        <Link to="/" className="nav-link text-white">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item py-2">
                        <Link to="/wilayah" className="nav-link text-white">
                            Wilayah
                        </Link>
                    </li>
                    <li className="nav-item py-2">
                        <Link to="/produk" className="nav-link text-white">
                            Produk
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;