import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useLayout } from '../context/LayoutContext';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { sidebarVisible } = useLayout();

    return (
        <div className="main-layout">
            {sidebarVisible && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

            <div className={`main-content ${!sidebarVisible ? 'full-width' : ''}`}>
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
