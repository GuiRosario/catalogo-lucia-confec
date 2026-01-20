import React from 'react';

const WhatsAppButton = () => {
    const phoneNumber = "5563984803415";
    const message = "Olá! Gostaria de tirar algumas dúvidas.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar no WhatsApp"
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full 
                       shadow-[0_8px_20px_rgba(37,211,102,0.4)]
                       flex items-center justify-center
                       hover:scale-110 active:scale-95 transition-all duration-300 group"
            style={{ animation: 'float-whatsapp 3s ease-in-out infinite' }}
        >
            <style>
                {`
                    @keyframes float-whatsapp {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                `}
            </style>

            {/* Ícone WhatsApp correto */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="34"
                height="34"
                fill="currentColor"
            >
                <path d="M16 .4C7.4.4.4 7.3.4 15.8c0 2.8.7 5.4 2.1 7.8L.3 32l8.6-2.3c2.3 1.2 4.9 1.9 7.6 1.9 8.6 0 15.6-6.9 15.6-15.4C31.6 7.3 24.6.4 16 .4zm0 28.1c-2.4 0-4.7-.6-6.8-1.9l-.5-.3-5.1 1.3 1.4-4.9-.3-.5c-1.3-2-2-4.3-2-6.6 0-7 5.8-12.7 13-12.7s13 5.7 13 12.7-5.8 12.7-13 12.7zm7.2-9.6c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.7-.2-1 .2s-1.1 1.3-1.3 1.6c-.2.3-.4.3-.8.1-.4-.2-1.6-.6-3.1-2-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.6.2-.2.3-.4.4-.6.1-.2 0-.5-.1-.7-.1-.2-1-2.3-1.4-3.2-.4-.8-.7-.7-1-.7h-.9c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.6 1.5 3.8c.2.3 2.5 4 6.2 5.4.9.3 1.6.5 2.1.6.9.3 1.7.2 2.4.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5z" />
            </svg>

            <span className="absolute right-full mr-3 bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
                Fale Conosco
            </span>
        </a>
    );
};

export default WhatsAppButton;
