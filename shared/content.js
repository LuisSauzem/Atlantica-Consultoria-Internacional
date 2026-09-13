export const DIRECTOR_ROLES = [
  'Presidência', 'Vice-Presidência', 'Administrativo-Financeiro',
  'Comercial', 'Gestão de Pessoas', 'Marketing', 'Projetos',
];

export const DEFAULT_CONTENT = {
  names: ['Yasmim Teixeira', 'Donato Mörschbächer', 'Luís Gustavo Brum',
    'Huesley Padilha', 'Miguel Vigolo', 'Maria Isabela Gesswein', 'Bibiana Garcia'],
  phone: '(51) 99156-5793',
  photo: null,
};

export function initials(name) {
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words.at(-1)[0] : '')).toUpperCase();
}

export function validateContent(value) {
  if (!value || !Array.isArray(value.names) || value.names.length !== DIRECTOR_ROLES.length
    || value.names.some(name => typeof name !== 'string' || !name.trim() || name.trim().length > 100)) {
    throw new Error('Informe os sete nomes, com até 100 caracteres cada.');
  }
  if (typeof value.phone !== 'string' || !/^[+\d\s().-]{8,30}$/.test(value.phone)
    || value.phone.replace(/\D/g, '').length < 8) {
    throw new Error('Informe um número de telefone válido.');
  }
  return { names: value.names.map(name => name.trim()), phone: value.phone.trim() };
}
