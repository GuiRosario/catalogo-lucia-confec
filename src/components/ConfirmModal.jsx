import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar", isDanger = false }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCancel} />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-6 py-4 text-sm font-semibold text-white transition-colors ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-gray-800'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
