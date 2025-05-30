import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
    const [results, setResults] = useState([]);
    return (
        <SearchContext.Provider value={{ results, setResults }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => useContext(SearchContext);

