import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { API_URL } from '../utils/api';

interface WishlistContextType {
    wishlistItems: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isOffline } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
        if (user && !isOffline) return [];
        const saved = localStorage.getItem('nrk_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchWishlist = async () => {
            if (user && !isOffline) {
                try {
                    const response = await fetch(`${API_URL}/wishlist/${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setWishlistItems(data);
                    }
                } catch (error) {
                    console.error("Failed to sync wishlist from DB:", error);
                }
            } else {
                const saved = localStorage.getItem('nrk_wishlist');
                if (saved) setWishlistItems(JSON.parse(saved));
            }
        };

        fetchWishlist();
    }, [user, isOffline]);

    useEffect(() => {
        if (!user || isOffline) {
            localStorage.setItem('nrk_wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, user, isOffline]);

    const addToWishlist = async (product: Product) => {
        console.log("Attempting to add to wishlist:", product.id, "User:", user?.id);

        // Optimistic Update
        setWishlistItems(prev => {
            if (prev.some(p => p.id === product.id)) return prev;
            return [...prev, product];
        });

        if (user && !isOffline) {
            try {
                const res = await fetch(`${API_URL}/wishlist`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, productId: product.id })
                });

                if (!res.ok) {
                    const errData = await res.json();
                    console.error("Server Error adding to wishlist:", errData);
                    alert("Failed to save to Wishlist (Database Error). Check Console.");
                } else {
                    console.log("Successfully added to DB");
                }
            } catch (error) {
                console.error("Network Error adding to wishlist", error);
            }
        }
    };

    const removeFromWishlist = async (productId: string) => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));

        if (user && !isOffline) {
            try {
                await fetch(`${API_URL}/wishlist/${user.id}/${productId}`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.error("Failed to remove from DB wishlist", error);
            }
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlistItems.some(item => item.id === productId);
    }

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    }

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
    return context;
};