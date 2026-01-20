import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

const LoginModal = ({ onLogin, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await onLogin(password);
        if (!isValid) {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className="p-3 bg-gray-100 rounded-full mb-4">
                        <Lock size={24} className="text-black" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Acesso Restrito</h2>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Área exclusiva para administradores
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Digite a senha de acesso"
                            className={`w-full p-3 border rounded-xl outline-none focus:ring-2 transition-all ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-black focus:ring-black/5'}`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-2 ml-1">Senha incorreta. Tente novamente.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 active:scale-[0.98] transition-all"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
