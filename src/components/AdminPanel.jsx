import React, { useState } from 'react';
import { Plus, Trash2, Edit, X, Save, Image as ImageIcon, Loader2, Search } from 'lucide-react';
import { client, urlFor } from '../lib/sanity';

const AdminPanel = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onExit, showToast, onConfirm }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Helper to resolve image URL
    const getImageUrl = (img) => {
        if (!img) return '';
        if (typeof img === 'string') return img;
        try {
            return urlFor(img).width(200).url();
        } catch (e) {
            return '';
        }
    }

    const emptyProduct = {
        nome: '',
        preco: '',
        imagens: [], // Will hold { _type: 'image', asset: { _ref: ... } } or File objects temporarily
        cores: '',
        tamanhos: '',
        quantidade: ''
    };

    const [formData, setFormData] = useState(emptyProduct);
    const [imageFiles, setImageFiles] = useState([]); // Temporary holder for new file uploads

    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setFormData({
            ...product,
            preco: product.preco,
            imagens: product.imagens || [],
            cores: product.cores?.join(', ') || '',
            tamanhos: product.tamanhos?.join(', ') || '',
            quantidade: product.quantidade
        });
        setImageFiles([]);
        setIsEditing(true);
    };

    const handleAddNewClick = () => {
        setCurrentProduct(null);
        setFormData(emptyProduct);
        setImageFiles([]);
        setIsEditing(true);
    };

    const uploadImage = async (file) => {
        return client.assets.upload('image', file, { contentType: file.type, filename: file.name })
            .then(document => {
                return {
                    _type: 'image',
                    asset: {
                        _type: "reference",
                        _ref: document._id
                    }
                }
            })
            .catch(error => {
                console.error('Upload failed:', error.message);
                return null;
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Upload new images
            const uploadedImages = [];
            for (const file of imageFiles) {
                const asset = await uploadImage(file);
                if (asset) uploadedImages.push(asset);
            }

            // Combine existing images (that verify as Sanity objects) with new uploads
            // We filter out any 'string' legacy urls if we want to be strict, or keep them if migrating.
            // Assuming we only keep valid objects or new uploads.

            // If editing, formData.imagens has existing images.
            const finalImages = [...(formData.imagens || []), ...uploadedImages];

            const doc = {
                _type: 'product',
                nome: formData.nome,
                preco: parseFloat(formData.preco),
                quantidade: parseInt(formData.quantidade),
                imagens: finalImages,
                cores: formData.cores.split(',').map(c => c.trim()).filter(Boolean),
                tamanhos: formData.tamanhos.split(',').map(t => t.trim()).filter(Boolean)
            };

            let result;
            if (currentProduct) {
                // Update
                result = await client.patch(currentProduct._id).set(doc).commit();
                onUpdateProduct(result);
                showToast("Produto atualizado com sucesso!", "success");
            } else {
                // Create
                result = await client.create(doc);
                onAddProduct(result);
                showToast("Produto criado com sucesso!", "success");
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Error submitting product:", error);
            showToast("Erro ao salvar produto.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        onConfirm({
            title: "Excluir Produto?",
            message: "Tem certeza que deseja remover este item do estoque? Esta ação não pode ser desfeita.",
            confirmText: "Deletar",
            isDanger: true,
            onConfirm: () => onDeleteProduct(id)
        });
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeNewFile = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imagens: prev.imagens.filter((_, i) => i !== index)
        }));
    };

    const filteredProducts = products.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto p-4 pb-20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{currentProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                        <input
                            required
                            className="w-full p-2 border rounded-lg"
                            value={formData.nome}
                            onChange={e => setFormData({ ...formData, nome: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="w-full p-2 border rounded-lg"
                                value={formData.preco}
                                onChange={e => setFormData({ ...formData, preco: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantidade</label>
                            <input
                                required
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                value={formData.quantidade}
                                onChange={e => setFormData({ ...formData, quantidade: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Imagens</label>

                        {/* Existing Images */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.imagens?.map((img, idx) => (
                                <div key={idx} className="relative group w-20 h-24">
                                    <img
                                        src={getImageUrl(img)}
                                        className="w-full h-full object-cover rounded-lg border bg-gray-50"
                                        alt=""
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(idx)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {/* New Files Preview */}
                            {imageFiles.map((file, idx) => (
                                <div key={`new-${idx}`} className="relative group w-20 h-24">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="w-full h-full object-cover rounded-lg border bg-gray-50 opacity-80"
                                        alt="Preview"
                                        onLoad={() => URL.revokeObjectURL(file)}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/50 text-white text-[10px] px-1 rounded">Novo</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(idx)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <label className="w-20 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <Plus size={24} className="text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">Add</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Cores (separadas por vírgula)</label>
                        <input
                            required
                            placeholder="Ex: Preto, Branco, Azul Marinho"
                            className="w-full p-2 border rounded-lg"
                            value={formData.cores}
                            onChange={e => setFormData({ ...formData, cores: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tamanhos (separados por vírgula)</label>
                        <input
                            required
                            placeholder="Ex: P, M, G, GG"
                            className="w-full p-2 border rounded-lg"
                            value={formData.tamanhos}
                            onChange={e => setFormData({ ...formData, tamanhos: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="flex flex-col gap-4 mb-6 px-4 py-4 sticky top-0 bg-white z-10 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Gerenciar Produtos</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={onExit}
                            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                        >
                            Sair
                        </button>
                        <button
                            onClick={handleAddNewClick}
                            className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800"
                        >
                            <Plus size={16} />
                            Novo
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Pesquisar produto pelo nome..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-4">
                {filteredProducts.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        {searchTerm ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}
                    </div>
                )}
                {filteredProducts.map(product => (
                    <div key={product._id} className="flex gap-4 p-3 border rounded-xl bg-white shadow-sm">
                        <img
                            src={getImageUrl(product.imagens?.[0])}
                            className="w-16 h-20 object-cover rounded-lg bg-gray-100"
                            alt=""
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{product.nome}</h3>
                            <p className="text-sm text-gray-500">
                                Qtde: {product.quantidade} | {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                            <button
                                onClick={() => handleEditClick(product)}
                                className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;
