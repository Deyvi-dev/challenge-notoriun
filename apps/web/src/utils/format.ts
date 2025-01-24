export const formatCNPJ = (value: string): string => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export const formatCEP = (value: string): string => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export const formatPhone = (value: string): string => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  if (numbers.length === 11) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
}

export const cleanNumber = (value: string): string => {
  return value.replace(/\D/g, '')
}
