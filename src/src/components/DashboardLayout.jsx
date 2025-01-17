import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="d-flex h-100" style={{ width: '100%' }}>
            {/* Sidebar */}
            <div>
                <Sidebar />
            </div>
            
            {/* Main Content */}
            <div className="d-flex flex-column flex-grow-1">
                {/* Header */}
                <Header />
                
                {/* Content */}
                <main className="p-4 flex-grow-1 bg-main-layout">
                    <div className="">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;