import React from 'react';
import { Link, useLocation  } from 'react-router-dom';

const Sidebar = () => {
    const pathLocation = useLocation(0);
    return (
        <div className="d-flex flex-column bg-dark text-white h-100" style={{ width: '300px' }}>
            <div className="p-3">
                <h5 className="text-center h2 pb-1">MENU</h5>
                <hr className="text-white" />
                <ul className="nav flex-column h5">
                    <li className="nav-item py-2">
                        <Link to="/" className={`nav-link ${pathLocation.pathname === '/' ? 'active text-black' : 'text-white'}`}>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item py-2">
                        <Link to="/wilayah" className={`nav-link ${pathLocation.pathname === '/wilayah' ? 'active text-black' : 'text-white'} `}>
                            Wilayah
                        </Link>
                    </li>
                    {/* <li className="nav-item py-2">
                        <Link to="/produk" className={`nav-link ${pathLocation.pathname === '/produk' ? 'active text-black' : 'text-white'} `}>
                            Produk
                        </Link>
                    </li> */}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;