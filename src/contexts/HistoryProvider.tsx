import { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const HistoryContext = createContext<{ previousPath: string | null }>({ previousPath: null });

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const previousPath = useRef<string | null>(null);

    useEffect(() => {
        previousPath.current = location.pathname;
    }, [location]);

    return (
        <HistoryContext.Provider value={{ previousPath: previousPath.current }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistoryContext = () => useContext(HistoryContext);
