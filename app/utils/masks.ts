// Máscara para CNPJ: 00.000.000/0000-00
export const cnpjMask = (value: string): string => {
  if (!value) return "";

  // Remove tudo que não é dígito
  const onlyNumbers = value.replace(/\D/g, "");

  // Limita a 14 dígitos
  const limited = onlyNumbers.slice(0, 14);

  // Aplica a máscara
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 5) {
    return limited.replace(/(\d{2})(\d{0,3})/, "$1.$2");
  } else if (limited.length <= 8) {
    return limited.replace(/(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
  } else if (limited.length <= 12) {
    return limited.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
  } else {
    return limited.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
      "$1.$2.$3/$4-$5"
    );
  }
};

// Máscara para CEP: 00000-000
export const cepMask = (value: string): string => {
  if (!value) return "";

  // Remove tudo que não é dígito
  const onlyNumbers = value.replace(/\D/g, "");

  // Limita a 8 dígitos
  const limited = onlyNumbers.slice(0, 8);

  // Aplica a máscara
  if (limited.length <= 5) {
    return limited;
  } else {
    return limited.replace(/(\d{5})(\d{0,3})/, "$1-$2");
  }
};

// Máscara para Telefone: (00) 00000-0000 ou (00) 0000-0000
export const phoneMask = (value: string): string => {
  if (!value) return "";

  // Remove tudo que não é dígito
  const onlyNumbers = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  const limited = onlyNumbers.slice(0, 11);

  // Aplica a máscara
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 6) {
    return limited.replace(/(\d{2})(\d{0,4})/, "($1) $2");
  } else if (limited.length <= 10) {
    return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
};

// Remove a máscara (retorna apenas números)
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, "");
};
