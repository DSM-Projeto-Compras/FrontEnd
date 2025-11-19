import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useField } from 'formik';

const mockUseField = useField as jest.Mock;
jest.mock('formik', () => ({
    useField: jest.fn(),
}));

import SelectWrapper from '../../app/components/atoms/SelectWrapper';

const mockProps = {
  label: "Status do Pedido",
  id: "status-select",
  name: "status",
  options: [
    { value: "pending", label: "Pendente" },
    { value: "approved", label: "Aprovado" },
  ],
};

describe('SelectWrapper', () => {
  beforeEach(() => {
    mockUseField.mockReturnValue([
      { value: '', onChange: jest.fn(), onBlur: jest.fn() }, // field
      { touched: false, error: undefined }, // meta
      {}, // helpers
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('deve renderizar sem classe de largura extra quando isWide não é definido (Caso 3: "")', () => {
    // Renderiza sem passar a prop isWide
    render(<SelectWrapper {...mockProps} />);
    
    const wrapper = screen.getByText(mockProps.label).closest('div');
    
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).not.toHaveClass('md:w-1/2');
    expect(wrapper).not.toHaveClass('md:w-2/5');
  });

  it('deve aplicar a classe "md:w-1/2" quando isWide é true (Caso 1: md:w-1/2)', () => {
    render(<SelectWrapper {...mockProps} isWide={true} />);

    const wrapper = screen.getByText(mockProps.label).closest('div');

    expect(wrapper).toHaveClass('md:w-1/2');
    expect(wrapper).not.toHaveClass('md:w-2/5');
  });

  it('deve aplicar a classe "md:w-2/5" quando isWide é false (Caso 2: md:w-2/5)', () => {

    render(<SelectWrapper {...mockProps} isWide={false} />);

    const wrapper = screen.getByText(mockProps.label).closest('div');
    
    expect(wrapper).toHaveClass('md:w-2/5');
    expect(wrapper).not.toHaveClass('md:w-1/2');
  });


  it('deve exibir a mensagem de erro quando o campo for tocado e tiver erro', () => {
    const errorMessage = "Este campo é obrigatório.";
    
    mockUseField.mockReturnValue([
        { value: '', onChange: jest.fn(), onBlur: jest.fn() }, // field
        { touched: true, error: errorMessage }, // meta (touched: true, error: presente)
        {}, // helpers
    ]);

    render(<SelectWrapper {...mockProps} />);

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-red-600');
  });

  it('NÃO deve exibir a mensagem de erro quando houver erro mas NÃO for tocado (meta.touched é false)', () => {
    const errorMessage = "Este campo é obrigatório.";
    
    mockUseField.mockReturnValue([
        { value: '', onChange: jest.fn(), onBlur: jest.fn() }, // field
        { touched: false, error: errorMessage }, // meta (touched: false)
        {}, // helpers
    ]);

    render(<SelectWrapper {...mockProps} />);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });
});