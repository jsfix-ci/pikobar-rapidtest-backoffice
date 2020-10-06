export const getPersonStatusText = (value) => {
  if (value === 'ODP') {
    return 'ODP'
  }

  if (value === 'PDP') {
    return 'PDP'
  }

  if (value === 'OTG') {
    return 'OTG'
  }

  if (value === 'CONFIRMED') {
    return 'Konfirmasi'
  }

  if (value === 'SUSPECT') {
    return 'Suspek'
  }

  if (value === 'PROBABLE') {
    return 'Probable'
  }

  if (value === 'CLOSE_CONTACT') {
    return 'Kontak Erat'
  }

  if (value === 'NOT_ALL') {
    return 'Bukan Semuanya'
  }

  if (value === 'UNKNOWN') {
    return 'Tidak Tahu'
  }

  return value
}
