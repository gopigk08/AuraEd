import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
    const [headerTitle, setHeaderTitle] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    return (
        <LayoutContext.Provider value={{ headerTitle, setHeaderTitle, sidebarVisible, setSidebarVisible }}>
            {children}
        </LayoutContext.Provider>
    );
};
