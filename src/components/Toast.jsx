import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />
    };

    const bgColors = {
        success: 'bg-green-50 border-green-100',
        error: 'bg-red-50 border-red-100',
        info: 'bg-blue-50 border-blue-100'
    };

    return (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-300 ${bgColors[type]}`}>
            {icons[type]}
            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{message}</p>
            <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
