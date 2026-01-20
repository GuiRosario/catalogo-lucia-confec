import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onProductClick }) => {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <p className="text-gray-400 text-lg">Nenhum produto encontrado.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 px-4 py-6 pb-24">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onClick={onProductClick}
                />
            ))}
        </div>
    );
};

export default ProductList;
