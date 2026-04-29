/**
 * Formata um valor numérico para string de moeda BRL (R$ 0,00)
 */
export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Converte uma string de moeda (R$ 1.234,56) de volta para número (1234.56)
 */
export const parseCurrencyToNumber = (value: string): number => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return parseFloat(digits) / 100;
};

/**
 * Máscara visual para input enquanto o usuário digita
 */
export const maskCurrency = (value: string): string => {
  let cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return '';
  
  // Garante que tenha pelo menos 3 dígitos para centavos (ex: 005 -> 0,05)
  cleanValue = cleanValue.padStart(3, '0');
  
  const integerPart = cleanValue.slice(0, -2);
  const decimalPart = cleanValue.slice(-2);
  
  const formattedInteger = parseInt(integerPart, 10).toLocaleString('pt-BR');
  
  return `R$ ${formattedInteger},${decimalPart}`;
};
