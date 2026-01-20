import React, { useState } from 'react';
import { urlFor } from '../lib/sanity';
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight, Share2, ShoppingBag, Check } from 'lucide-react';

const ProductDetail = ({ product, onBack, onAddToCart, cartCount = 0, onOpenCart, showToast }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            nextImage();
        } else if (isRightSwipe) {
            prevImage();
        }
    };

    const getImageUrl = (img) => {
        if (!img) return '';
        if (typeof img === 'string') return img;
        try {
            return urlFor(img).width(800).url();
        } catch (e) {
            return '';
        }
    }

    const formatPrice = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Safe access arrays
    const images = product.imagens || [];
    const colors = product.cores || [];
    const sizes = product.tamanhos || [];

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            showToast("Por favor, selecione uma cor e um tamanho.", "info");
            return;
        }

        onAddToCart(product, selectedColor, selectedSize);
        showToast(`${product.nome} adicionado à sacola!`, "success");
        // We don't call onBack() so the sidebar slides over the product detail
        // onBack(); 
    };

    const nextImage = () => {
        if (images.length === 0) return;
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        if (images.length === 0) return;
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-300">

            {/* Navbar Detalhe */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-transparent flex items-center justify-between px-4 z-10 pointer-events-none">
                <button
                    onClick={onBack}
                    className="bg-white p-2 rounded-full shadow-lg pointer-events-auto hover:bg-gray-100 transition-colors border border-gray-100"
                >
                    <ArrowLeft size={22} className="text-black" />
                </button>

                <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                        onClick={onOpenCart}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-100 relative"
                    >
                        <ShoppingBag size={20} className="text-black" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-100"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: product.nome,
                                    text: `Confira ${product.nome} por ${formatPrice(product.preco)}`,
                                    url: window.location.href,
                                }).catch(console.error);
                            } else {
                                showToast("Compartilhamento não suportado neste navegador.", "info");
                            }
                        }}
                    >
                        <Share2 size={20} className="text-black" />
                    </button>
                </div>
            </div>

            <div className="pb-28">
                {/* Galeria de Imagens */}
                <div
                    className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <img
                        src={getImageUrl(images[selectedImage])}
                        alt={product.nome}
                        className="w-full h-full object-cover select-none pointer-events-none"
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-black border border-gray-100 active:scale-95 transition-all z-20 pointer-events-auto"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg text-black border border-gray-100 active:scale-95 transition-all z-20 pointer-events-auto"
                            >
                                <ChevronRight size={24} />
                            </button>

                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full bg-black/20 backdrop-blur-md z-20 pointer-events-none">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === selectedImage ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Informações do Produto */}
                <div className="px-5 py-6 space-y-8">
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-2xl font-light text-gray-900 leading-tight">{product.nome}</h1>
                            {product.quantidade < 5 && product.quantidade > 0 && (
                                <span className="shrink-0 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded ml-2">
                                    Restam {product.quantidade}
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{formatPrice(product.preco)}</p>
                        <p className="text-gray-500 text-sm mt-1">Em até 3x sem juros</p>
                    </div>

                    {/* Seleção de Cores */}
                    <div>
                        <p className="text-sm font-medium text-gray-900 mb-3">Cores disponíveis</p>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((cor) => {
                                const colorsMap = {
                                    "Preto": "#000000",
                                    "Branco": "#FFFFFF",
                                    "Azul": "#3B82F6",
                                    "Azul Escuro": "#1E3A8A",
                                    "Azul Claro": "#93C5FD",
                                    "Indigo": "#4F46E5",
                                    "Vermelho": "#EF4444",
                                    "Cinza": "#6B7280"
                                };
                                const bg = colorsMap[cor] || '#E5E7EB';
                                const isWhite = cor === "Branco";

                                return (
                                    <button
                                        key={cor}
                                        onClick={() => setSelectedColor(cor)}
                                        className={`
                      relative h-12 px-4 rounded-lg flex items-center justify-center gap-2 border-2 transition-all
                      ${selectedColor === cor
                                                ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'}
                    `}
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-full border ${isWhite ? 'border-gray-300' : 'border-black/20'}`}
                                            style={{ backgroundColor: bg }}
                                        />
                                        <span className={`text-sm font-semibold ${selectedColor === cor ? 'text-white' : 'text-gray-900'}`}>
                                            {cor}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Seleção de Tamanhos */}
                    <div>
                        <p className="text-sm font-medium text-gray-900 mb-3">Tamanhos</p>
                        <div className="flex flex-wrap gap-3">
                            {sizes.map((tam) => (
                                <button
                                    key={tam}
                                    onClick={() => setSelectedSize(tam)}
                                    className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all
                    ${selectedSize === tam
                                            ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'}
                  `}
                                >
                                    {tam}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Descrição simulada */}
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Este produto é confeccionado com materiais de alta qualidade, garantindo conforto e durabilidade.
                            Ideal para o dia a dia ou ocasiões especiais. Consulte nossa tabela de medidas para o ajuste perfeito.
                        </p>
                    </div>
                </div>
            </div>

            {/* Barra de Ação Fixa */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center gap-3 safe-area-bottom z-50">
                <button
                    onClick={handleAddToCart}
                    disabled={product.quantidade === 0}
                    className={`
             flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all active:scale-[0.98]
             ${product.quantidade > 0
                            ? 'bg-black hover:bg-gray-800 shadow-lg'
                            : 'bg-gray-400 cursor-not-allowed'}
           `}
                >
                    {product.quantidade > 0 ? (
                        <>
                            <ShoppingBag size={20} />
                            <span>Adicionar à Sacola</span>
                        </>
                    ) : (
                        <span>Produto Esgotado</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
