import React from 'react';
import { X, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { urlFor } from '../lib/sanity';

const CartSidebar = ({ cart, isOpen, onClose, onRemoveItem, showToast }) => {
    const formatPrice = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const getImageUrl = (img) => {
        if (!img) return '';
        if (typeof img === 'string') return img;
        try {
            return urlFor(img).width(200).url();
        } catch (e) {
            return '';
        }
    }

    const handleCheckout = () => {
        if (cart.length === 0) return;

        let message = `Olá! Gostaria de finalizar meu pedido com os seguintes itens:\n\n`;
        let total = 0;

        cart.forEach((item, index) => {
            message += `*${index + 1}. ${item.product.nome}*\n`;
            message += `   Cor: ${item.color}\n`;
            message += `   Tamanho: ${item.size}\n`;
            message += `   Preço: ${formatPrice(item.product.preco)}\n`;
            message += `   Foto: ${getImageUrl(item.product.imagens[0])}\n\n`;
            total += item.product.preco;
        });

        message += `*Total Estimado: ${formatPrice(total)}*`;

        const url = `https://wa.me/5563984803415?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="text-gray-900" size={24} />
                        <h2 className="text-lg font-semibold text-gray-900">Sua Sacola ({cart.length})</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                            <ShoppingBag size={48} className="opacity-20" />
                            <p className="text-lg font-medium">Sua sacola está vazia</p>
                            <button
                                onClick={onClose}
                                className="text-gray-900 font-semibold underline"
                            >
                                Voltar as compras
                            </button>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-20 h-24 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                    <img
                                        src={getImageUrl(item.product.imagens[0])}
                                        alt={item.product.nome}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900 line-clamp-1">{item.product.nome}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {item.color} • {item.size}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-semibold text-gray-900">
                                            {formatPrice(item.product.preco)}
                                        </span>
                                        <button
                                            onClick={() => {
                                                onRemoveItem(index);
                                                showToast("Item removido da sacola", "info");
                                            }}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-white space-y-4 safe-area-bottom">
                        <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                            <span>Total</span>
                            <span>
                                {formatPrice(cart.reduce((acc, item) => acc + item.product.preco, 0))}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-[0.98]"
                        >
                            <MessageCircle size={20} />
                            Finalizar no WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
