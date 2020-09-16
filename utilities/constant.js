export const EVENT_SUCCESS_CREATE = 'Kegiatan berhasil di daftarkan'
export const EVENT_SUCCESS_UPDATE = 'Kegiatan berhasil di perbaharui'
export const SUCCESS_IMPORT = 'Import data berhasil'
export const FAILED_IMPORT = 'Import data gagal'
export const EVENT_BLAST_EMPTY = 'Anda Belum Memilih Peserta'
export const EVENT_PARTICIPANTS_EMPTY = 'Peserta Kegiatan kosong'
export const EVENT_BLAST_SUCCESS = 'Notifikasi berhasil di kirim'
export const SUCCESS_DELETE = 'Data berhasil di hapus'
export const FAILED_DELETE = 'Maaf, ada kesalahan dalam menghapus data'
export const CONFIRM_DELETE =
  'Apakah anda yakin akan menghapus data kegiatan dengan ID: '
export const SUCCESS_ADD_PARTICIPANTS =
  'Peserta berhasil di daftarkan dalam kegiatan'
export const FAILED_ADD_PARTICIPANTS =
  'Maaf, ada kesalahan dalam mendaftarkan peserta'
export const SET_LABCODE_SUCCESS =
  'Kode Sampel Hasil Lab Berhasil di perbaharui'
export const SET_LABCODE_FAILED =
  'Maaf, ada kesalahan dalam menyimpan Kode Sampel Hasil Lab '

export const DEFAULT_FILTER = {
  groupBy: [],
  groupDesc: [],
  sortBy: ['created_at'],
  sortDesc: [true],
  sortOrder: 'desc',
  status: 'published',
  multiSort: false,
  mustSort: false,
  keyWords: undefined
}
export const DEFAULT_PAGINATION = {
  page: 1,
  itemsPerPage: 50,
  total: 0
}
