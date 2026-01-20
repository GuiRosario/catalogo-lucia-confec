import React from 'react';
import { urlFor } from '../lib/sanity';

const ProductCard = ({ product, onClick }) => {
    // Helper to get image URL safely
    const getImageUrl = (img) => {
        if (!img) return '';
        if (typeof img === 'string') return img; // For legacy mock data/ string urls
        try {
            return urlFor(img).width(500).url(); // Resize for card
        } catch (e) {
            return '';
        }
    }

    return (
        <div
            className="group cursor-pointer flex flex-col gap-2"
            onClick={() => onClick(product)}
        >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                <img
                    src={getImageUrl(product.imagens?.[0])}
                    alt={product.nome}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.quantidade < 5 && product.quantidade > 0 && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        Últimas Peças
                    </span>
                )}
                {product.quantidade === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                            Esgotado
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col px-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 line-clamp-1 text-base">{product.nome}</h3>
                </div>
                <p className="font-semibold text-gray-900 mt-0.5">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                    {product.cores?.length || 0} cores • {product.tamanhos?.length || 0} tamanhos
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
