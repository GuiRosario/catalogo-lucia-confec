import React, { useState } from 'react';
import { Search, ShoppingBag, Lock, Menu, X } from 'lucide-react';

const Header = ({ onSearch, onToggleAdmin, onGoHome, isAdmin, cartCount = 0, onOpenCart, showToast }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchValue);
    };

    const handleClearSearch = () => {
        setSearchValue("");
        onSearch("");
        setIsSearchOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Brand */}
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={onGoHome}
                >
                    <div className="bg-black text-white p-1.5 rounded-lg transition-transform group-hover:scale-110">
                        <ShoppingBag size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Lucia Confecções</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Search Toggle */}
                    {isSearchOpen ? (
                        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 transition-all w-full max-w-[200px]">
                            <Search size={16} className="text-gray-500 min-w-4" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                                autoFocus
                            />
                            <button onClick={handleClearSearch} className="ml-1 text-gray-400 hover:text-gray-600">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <Search size={22} strokeWidth={2} />
                        </button>
                    )}

                    {/* Cart Toggle */}
                    <button
                        onClick={onOpenCart}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors relative"
                    >
                        <ShoppingBag size={22} strokeWidth={2} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Admin Toggle (Hidden feature) */}
                    <button
                        onClick={onToggleAdmin}
                        className={`p-2 rounded-full transition-colors ${isAdmin ? 'bg-black text-white hover:bg-gray-800' : 'hover:bg-gray-100 text-gray-400'}`}
                        title={isAdmin ? "Sair do Admin" : "Acessar Admin"}
                    >
                        <Lock size={20} strokeWidth={isAdmin ? 2.5 : 2} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
