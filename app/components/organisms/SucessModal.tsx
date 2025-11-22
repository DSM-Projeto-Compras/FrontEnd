import React from 'react';

interface SuccessModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay (fundo escuro)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Container do Modal */}
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
        <div className="flex flex-col items-center">
          {/* Ícone de Sucesso */}
          <div className="text-green-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sucesso!</h2>
          <p className="text-center text-gray-600 mb-6">{message}</p>
          
          {/* Botão de Ação */}
          <button
            onClick={onClose}
            data-testid="success-modal-button"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            Fazer Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;