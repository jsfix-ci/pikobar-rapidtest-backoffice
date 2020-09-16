<template>
  <div style="width: 100%;">
    <v-row>
      <v-col cols="6" class="d-flex align-center pb-0">
        <h3>Daftar Peserta</h3>
      </v-col>
      <v-col
        v-if="allow.includes('manage-events')"
        cols="6"
        class="d-flex align-center justify-end pb-0"
      >
        <v-btn color="primary" :to="`/events/${$route.params.eventId}/add`">
          <v-icon class="mr-1">mdi-plus-circle</v-icon>
          Tambah Peserta
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          v-if="allow.includes('notify-participants')"
          color="primary"
          @click="openModalNotif('Undangan')"
        >
          <v-icon class="mr-1">mdi-email-send</v-icon>
          Kirim Undangan
        </v-btn>
        <v-btn
          v-if="allow.includes('notify-participants')"
          color="success"
          @click="openModalNotif('Hasil Test')"
        >
          <v-icon class="mr-1">mdi-file-send-outline</v-icon>
          Kirim Hasil Test
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn
          v-if="allow.includes('manage-events')"
          color="success"
          @click="openModalImportHasil"
        >
          <v-icon class="mr-1">mdi-file-import-outline</v-icon>
          Import Hasil Test
        </v-btn>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="pr-1" v-bind="attrs" color="error" v-on="on">
              Export
              <v-icon class="ml-1">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in [
                { icon: 'table', format: 'xls', text: 'Excel' },
                { icon: 'pdf-box', format: 'pdf', text: 'PDF' }
              ]"
              :key="i"
              @click="downloadExport(item.format)"
            >
              <v-list-item-title>
                <v-icon class="mr-1">mdi-{{ item.icon }}</v-icon>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-data-table
      v-model="pesertaSelected"
      class="v-card v-sheet rounded-t-0 pkbr-table sticky-last"
      :headers="headers"
      :server-items-length="totalItems"
      :items="records"
      :loading="loading"
      :options.sync="options"
      fixed-header
      show-select
      item-key="rdt_applicant_id"
      :header-props="{
        class: 'blue-grey lighten-3'
      }"
    >
      <template slot="top">
        <div class="d-flex">
          <v-col cols="6">
            <v-text-field
              v-model="searchKey"
              label="Nama Peserta / No. Pendaftaran / Kode Sampel"
              clearable
              outlined
              dense
              hide-details
            />
          </v-col>
        </div>
      </template>
      <template v-slot:[`item.notified_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.notified_result_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.created_at`]="{ value }">
        {{ $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') }}
      </template>
      <template v-slot:[`item.attended_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.result_at`]="{ value }">
        {{
          !!value ? $dateFns.format(new Date(value), 'dd MMMM yyyy HH:mm') : ''
        }}
      </template>
      <template v-slot:[`item.lab_result_type`]="{ value }">
        {{ value }}
      </template>
      <template v-slot:[`item.applicant.status`]="{ value }">
        <v-chip small class="ma-2" :color="value | getChipColor">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:[`item.applicant.birth_date`]="{ item }">
        <v-layout justify-start>
          {{ item.applicant.age }}
        </v-layout>
      </template>
      <template v-slot:[`item.applicant.gender`]="{ item }">
        <v-layout
          v-if="typeof item.applicant.gender !== 'undefined'"
          justify-start
        >
          <template v-if="item.applicant.gender === 'M'">
            Laki-Laki
          </template>
          <template v-if="item.applicant.gender === 'F'">
            Perempuan
          </template>
        </v-layout>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="modalEditLabCodeOpen(item.id)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="blastNotifModal" max-width="528">
      <v-card class="text-center">
        <v-card-title>
          <span class="col pl-10">Kirim {{ modalType }}</span>
          <v-btn icon @click="blastNotifModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>
            Apakah anda akan mengirimkan notifikasi {{ modalType }} kepada
          </div>
          <strong>Peserta Terpilih</strong> atau <strong>Semua Peserta</strong>.
        </v-card-text>
        <v-card-actions class="pb-6 justify-center">
          <v-btn
            color="grey darken-1"
            outlined
            class="mr-2 px-2"
            @click="blastNotify(null, `send${modalType.split(' ').join('')}`)"
          >
            Semua
          </v-btn>
          <v-btn
            color="primary"
            class="ml-2 px-2"
            @click="
              blastNotify(
                pesertaSelected,
                `send${modalType.split(' ').join('')}`
              )
            "
          >
            Terpilih
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="ImportModalTest" max-width="528">
      <validation-observer
        v-slot="{ valid, handleSubmit }"
        ref="observerImport"
        tag="div"
      >
        <form ref="importForm" @submit.prevent="handleSubmit(doImport)">
          <v-card class="text-center">
            <v-card-title>
              <span class="col">Import Hasil Test</span>
            </v-card-title>
            <v-card-text class="pb-0">
              <div>
                Untuk Import data hasil test, anda harus memakai format Excel
                (.xls).
              </div>
              <pkbr-input
                v-model="importFile"
                label="Import Hasil Test"
                type="file"
                class="mt-4"
                name="file"
                rules="required"
              />
            </v-card-text>
            <v-card-actions class="pb-6 justify-center">
              <v-btn
                color="grey darken-1"
                outlined
                class="mr-2 px-2"
                @click="ImportModalTest = false"
              >
                Batal
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!valid"
                class="ml-2 px-2"
                type="submit"
              >
                Upload
              </v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </validation-observer>
    </v-dialog>
    <event-applicant-edit-lab-code-dialog
      :open="modalEditLabCode"
      :record-id="modalEditLabCodeId"
      @close="modalEditLabCodeClose"
      @save="modalEditLabCodeSave"
    />
    <dialog-export-loader :open="modalExportLoader" />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import { getChipColor } from '@/utilities/formater'
import {
  EVENT_BLAST_EMPTY,
  EVENT_BLAST_SUCCESS,
  EVENT_PARTICIPANTS_EMPTY,
  SUCCESS_IMPORT,
  FAILED_IMPORT,
  SET_LABCODE_SUCCESS,
  SET_LABCODE_FAILED,
  DEFAULT_PAGINATION,
  DEFAULT_FILTER
} from '@/utilities/constant'
import EventApplicantEditLabCodeDialog from '@/components/EventApplicantEditLabCodeDialog'
import DialogExportLoader from '@/components/DialogLoader'

const headers = [
  {
    text: 'Nomor Pendaftaran',
    value: 'applicant.registration_code',
    sortable: false,
    width: 150
  },
  { text: 'Nama Lengkap', value: 'applicant.name', width: 250 },
  { text: 'Kloter', value: 'rdt_event_schedule_id', width: 85 },
  { text: 'Jenis Kelamin', value: 'applicant.gender', width: 140 },
  { text: 'Usia', value: 'applicant.birth_date', width: 85 },
  { text: 'Lokasi Checkin', value: 'attend_location', width: 250 },
  { text: 'Terdaftar', value: 'created_at', width: 200 },
  { text: 'Checkin', value: 'attended_at', width: 200 },
  { text: 'Kode Sampel', value: 'lab_code_sample', width: 150 },
  { text: 'Tanggal Hasil Test', value: 'result_at', width: 200 },
  { text: 'Hasil Test', value: 'lab_result_type', width: 150 },
  { text: 'Kirim Undangan', value: 'notified_at', width: 200 },
  {
    text: 'Kirim Hasil',
    value: 'notified_result_at',
    width: 200
  },
  { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
]

export default {
  components: {
    EventApplicantEditLabCodeDialog,
    DialogExportLoader
  },
  filters: {
    getChipColor
  },

  props: {
    idEvent: {
      type: [Number, String],
      default: null
    },
    allow: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      headers,
      pesertaSelected: [],
      blastNotifModal: false,
      ImportModalTest: false,
      modalType: 'Undangan',
      importFile: null,
      modalExportLoader: false,
      modalEditLabCode: false,
      modalEditLabCodeId: null
    }
  },

  computed: {
    records() {
      return this.$store.getters['eventParticipants/getList']
    },
    loading() {
      return this.$store.getters['eventParticipants/getLoading']
    },
    options: {
      set(value) {
        this.$store.commit('eventParticipants/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['eventParticipants/getTableOption']
      }
    },
    totalItems() {
      return this.$store.getters['eventParticipants/getTotalData']
    },
    searchKey: {
      async set(value) {
        await this.$store.dispatch('eventParticipants/resetOptions')
        this.options = {
          ...this.options,
          keyWords: value
        }
      },
      get() {
        return this.$route.query.keyWords
      }
    }
  },

  watch: {
    options(value, oldValue) {
      if (!isEqual(oldValue, value)) {
        this.$emit('optionChanged', value)
      }
    }
  },

  mounted() {
    const options = { ...this.options }
    options.page = this.$route.query.page
      ? parseInt(this.$route.query.page)
      : DEFAULT_PAGINATION.page
    options.itemsPerPage = this.$route.query.perPage
      ? parseInt(this.$route.query.perPage)
      : DEFAULT_PAGINATION.itemsPerPage
    options.sortBy = this.$route.query.sortBy
      ? [this.$route.query.sortBy]
      : DEFAULT_FILTER.sortBy
    options.sortDesc = this.$route.query.sortOrder
      ? [this.$route.query.sortOrder === 'desc']
      : DEFAULT_FILTER.sortDesc
    options.keyWords = this.$route.query.keyWords
      ? this.$route.query.keyWords
      : DEFAULT_FILTER.keyWords
    this.options = options
    this.$emit('optionChanged', options)
  },

  methods: {
    openModalNotif(type) {
      this.modalType = type || this.modalType
      this.blastNotifModal = true
    },
    openModalImportHasil() {
      this.ImportModalTest = true
    },
    async doImport() {
      const formData = new FormData()
      formData.append('file', this.importFile)
      try {
        await this.$store.dispatch('eventParticipants/importTestResult', {
          idEvent: this.idEvent,
          formData
        })
        this.$toast.show({
          message: SUCCESS_IMPORT,
          type: 'success'
        })
        this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
        this.ImportModalTest = false
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_IMPORT,
          type: 'error'
        })
      } finally {
        // this.importModal = false
        // this.kloter = null
        // this.$refs.observerImport.reset()
      }
    },
    async blastNotify(invitationsIds, type) {
      if (this.records.length === 0) {
        this.$toast.show({
          message: EVENT_PARTICIPANTS_EMPTY,
          type: 'error'
        })
      } else if (!!invitationsIds && invitationsIds.length === 0) {
        this.$toast.show({
          message: EVENT_BLAST_EMPTY,
          type: 'error'
        })
      } else {
        try {
          const typeBlast = type || 'sendUndangan'
          const target =
            !!invitationsIds && invitationsIds.length > 0 ? 'SELECTED' : 'ALL'
          // eslint-disable-next-line camelcase
          const invitations_ids =
            !!invitationsIds && invitationsIds.length > 0
              ? invitationsIds.map((inv) => inv.id)
              : null
          await this.$store.dispatch(`blastNotif/${typeBlast}`, {
            idEvent: this.idEvent,
            target,
            invitations_ids
          })
          this.$toast.show({
            message: EVENT_BLAST_SUCCESS,
            type: 'success'
          })
          this.blastNotifModal = false
        } catch (error) {
          this.$toast.show({
            message: error.message,
            type: 'error'
          })
        }
      }
    },
    modalEditLabCodeOpen(id) {
      this.modalEditLabCodeId = id
      this.modalEditLabCode = true
    },
    modalEditLabCodeClose() {
      this.modalEditLabCodeId = null
      this.modalEditLabCode = false
    },
    async modalEditLabCodeSave(payload) {
      try {
        await this.$store.dispatch('eventParticipants/setLabcode', {
          idEvent: this.idEvent,
          ...payload
        })
        this.$toast.show({
          message: SET_LABCODE_SUCCESS,
          type: 'success'
        })
        this.modalEditLabCodeClose()
      } catch (error) {
        this.$toast.show({
          message: error.message || SET_LABCODE_FAILED,
          type: 'error'
        })
      } finally {
        this.$store.dispatch(
          'eventParticipants/getList',
          this.$route.params.eventId
        )
      }
    },

    downloadExport(format) {
      this.modalExportLoader = true

      this.$axios
        .get(
          `/rdt/events/${this.idEvent}/participants-export-f1?format=${format}`,
          {
            responseType: 'blob'
          }
        )
        .then((response) => {
          // @TODO hacky solution
          // eslint-disable-next-line no-new
          const blob = new Blob([response.data], { type: response.data.type })

          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')

          link.href = url

          const contentDisposition = response.headers['content-disposition']
          let fileName = 'unknown'

          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
            if (fileNameMatch.length === 2) {
              fileName = fileNameMatch[1]
            }
          }

          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(url)

          this.modalExportLoader = false
        })
        .catch(() => {
          alert('Telah terjadi sebuah kesalahan. Silahkan coba ulangi kembali.')
          this.modalExportLoader = false
        })
    }
  }
}
</script>
