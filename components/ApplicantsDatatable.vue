<template>
  <div style="width: 100%;">
    <v-data-table
      v-model="tempValue"
      class="v-card v-sheet pkbr-table"
      :class="{ 'sticky-last': stickyActions }"
      :headers="headers"
      :items="records"
      :server-items-length="totalItems"
      :options.sync="options"
      :loading="loading"
      :show-select="showSelect"
      fixed-header
      :header-props="{
        class: 'blue-grey lighten-3'
      }"
      :footer-props="{
        'items-per-page-options': [50, 100, 500]
      }"
    >
      <template slot="top">
        <div v-if="!noHead" class="d-flex flex-wrap">
          <v-col v-if="title" cols="12">
            {{ title }}
          </v-col>
          <v-col cols="auto">
            <v-text-field
              v-model="searchKey"
              label="Nama Peserta / Nomor Pendaftaran"
              clearable
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col cols="auto">
            <pkbr-select
              v-model="city"
              :items="getKabkot"
              label="Kab./Kota"
              name="Kab./Kota"
              placeholder="Semua Kab./Kota"
              item-text="name"
              item-value="code"
              hide-details
              allow-null
            />
          </v-col>
          <v-col cols="auto">
            <v-text-field
              v-model="sessionId"
              label="Session ID"
              clearable
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn
              v-if="allow.includes('create-applicants')"
              color="primary"
              @click="createDialog = true"
            >
              <v-icon class="mr-1">
                mdi-plus-circle
              </v-icon>
              Tambah Peserta
            </v-btn>
          </v-col>
        </div>
      </template>
      <template v-slot:[`item.invitations`]="{ item }">
        <v-layout justify-start>
          {{ getLatestInvitation(item.invitations) }}
        </v-layout>
      </template>
      <template v-slot:[`item.gender`]="{ item }">
        <v-layout justify-start>
          <template v-if="item.gender === 'F'">
            Perempuan
          </template>
          <template v-if="item.gender === 'M'">
            Laki-Laki
          </template>
        </v-layout>
      </template>
      <template v-slot:[`item.symptoms_interaction`]="{ item }">
        <v-layout justify-center>
          <template v-if="item.symptoms_interaction === '0'">
            Ya
          </template>
          <template v-if="item.symptoms_interaction === '1'">
            Ya
          </template>
          <template v-if="item.symptoms_interaction === '2'">
            Tidak Tahu
          </template>
        </v-layout>
      </template>
      <template v-slot:[`item.person_status`]="{ item }">
        <v-layout justify-start>
          {{ getPersonStatusText(item.person_status) }}
        </v-layout>
      </template>
      <template v-slot:[`item.age`]="{ item }">
        <v-layout justify-end>
          {{ item.age }}
        </v-layout>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <v-layout justify-end>
          {{ $dateFns.format(new Date(item.created_at), 'dd MMMM yyyy HH:mm') }}
        </v-layout>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          v-if="allow.includes('view-applicants')"
          class="mr-2"
          @click="viewItem(item)"
        >
          mdi-card-search
        </v-icon>
        <v-icon
          v-if="allow.includes('edit-applicants')"
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="allow.includes('delete-applicants')"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <applicant-create-dialog
      :open="createDialog"
      @close="createClose"
      @save="createSave"
    />

    <applicant-view-dialog
      v-if="allow.includes('view-applicants')"
      :open="viewDialog"
      :record-id="viewRecordId"
      @close="viewClose"
    />
    <applicant-edit-dialog
      v-if="allow.includes('edit-applicants')"
      :open="editDialog"
      :record-id="editRecordId"
      @close="editClose"
      @save="editSave"
    />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import { mapGetters } from 'vuex'
import ApplicantCreateDialog from '@/components/ApplicantCreateDialog'
import ApplicantEditDialog from '@/components/ApplicantEditDialog'
import ApplicantViewDialog from '@/components/ApplicantViewDialog'
// import {
//   SUCCESS_DELETE,
//   FAILED_DELETE,
//   CONFIRM_DELETE
// } from '@/utilities/constant'
// import { getChipColor } from '@/utilities/formater'

const headers = [
  { text: 'ID', value: 'id', width: 80 },
  {
    text: 'Nomor Pendaftaran',
    value: 'registration_code',
    sortable: false,
    width: 150
  },
  { text: 'Session Code', value: 'pikobar_session_id', width: 150 },
  { text: 'Nama Peserta', value: 'name', width: 250 },
  { text: 'Status Kesehatan', value: 'person_status', width: 150 },
  { text: 'Jenis Kelamin', value: 'gender', width: 150 },
  { text: 'Usia (Thn)', value: 'age', width: 120 },
  { text: 'Kota/Kab', value: 'city.name', sortable: false, width: 200 },
  { text: 'Jenis Pekerjaan', value: 'occupation_type', width: 150 },
  { text: 'Nama Profesi', value: 'occupation_name', width: 250 },
  { text: 'Tempat Kerja', value: 'workplace_name', width: 250 },
  { text: 'Riwayat Kontak', value: 'symptoms_interaction', width: 150 },
  { text: 'Gejala', value: 'symptoms_notes', sortable: false, width: 300 },
  {
    text: 'Riwayat Undangan',
    value: 'invitations',
    sortable: false,
    width: 300
  },
  { text: 'Tanggal Terdaftar', value: 'created_at', width: 180 },
  { text: 'Actions', value: 'actions', sortable: false, width: 150 }
]
export default {
  components: {
    ApplicantCreateDialog,
    ApplicantViewDialog,
    ApplicantEditDialog
  },

  props: {
    value: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: null
    },
    noHead: {
      type: Boolean,
      default: false
    },
    noActions: {
      type: Boolean,
      default: false
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    allow: {
      type: Array,
      default: () => []
    },
    stickyActions: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tempValue: this.value,
      createDialog: false,
      editDialog: false,
      editRecordId: null,
      viewDialog: false,
      viewRecordId: null,
      filterSearch: null,
      headers: this.noActions
        ? headers.filter((head) => head.value !== 'actions')
        : headers
    }
  },

  computed: {
    ...mapGetters('area', ['getKabkot']),
    records() {
      return this.$store.getters['applicants/getList']
    },
    loading() {
      return this.$store.getters['applicants/getLoading']
    },
    options: {
      set(value) {
        this.$store.commit('applicants/SET_TABLE_OPTIONS', value)
      },
      get() {
        return this.$store.getters['applicants/getTableOption']
      }
    },
    totalItems() {
      return this.$store.getters['applicants/getTotalData']
    },
    city: {
      async set(value) {
        await this.$store.dispatch('applicants/resetOptions')
        this.options = {
          ...this.options,
          keyWords: this.searchKey,
          sessionId: this.sessionId,
          city: value
        }
      },
      get() {
        return this.$route.query.city
      }
    },
    searchKey: {
      async set(value) {
        await this.$store.dispatch('applicants/resetOptions')
        this.options = {
          ...this.options,
          city: this.city,
          sessionId: this.sessionId,
          keyWords: value
        }
      },
      get() {
        return this.$route.query.keyWords
      }
    },
    sessionId: {
      async set(value) {
        await this.$store.dispatch('applicants/resetOptions')
        this.options = {
          ...this.options,
          city: this.city,
          keyWords: this.keyWords,
          sessionId: value
        }
      },
      get() {
        return this.$route.query.sessionId
      }
    }
  },

  watch: {
    options(value, oldValue) {
      if (!isEqual(oldValue, value)) {
        this.$emit('optionChanged', value)
      }
    },
    value(value) {
      this.tempValue = value
    },
    tempValue(value) {
      this.$emit('input', value)
    }
  },

  mounted() {
    const options = { ...this.options }
    if (this.$route.query.page) {
      options.page = parseInt(this.$route.query.page)
    }
    if (this.$route.query.perPage) {
      options.perPage = parseInt(this.$route.query.perPage)
    }
    if (this.$route.query.sortBy) {
      options.sortBy = [this.$route.query.sortBy]
    }
    if (this.$route.query.sortOrder) {
      options.sortOrder = [this.$route.query.sortOrder]
    }
    if (this.$route.query.keyWords) {
      options.keyWords = this.$route.query.keyWords
    }
    if (this.$route.query.city) {
      options.city = this.$route.query.city
    }
    if (this.$route.query.sessionId) {
      options.sessionId = this.$route.query.sessionId
    }
    this.options = options
    this.$emit('optionChanged', options)
  },

  methods: {
    doFilterReset() {
      this.filterSearch = null
      this.doFilter()
    },

    doFilter() {
      // this.getRecords()
    },

    createClose() {
      this.createDialog = false
    },

    async createSave() {
      this.createClose()
      await this.$store.dispatch('applicants/getList') // @TODO lost current state?
    },

    viewItem(item) {
      this.viewRecordId = item.id
      this.viewDialog = true
    },

    viewClose() {
      this.viewDialog = false
      this.viewRecordId = null
    },

    editItem(item) {
      this.editRecordId = item.id
      this.editDialog = true
    },

    deleteItem(item) {
      //
    },

    editClose() {
      this.editDialog = false
      this.editRecordId = null
    },

    async editSave() {
      this.editClose()
      await this.$store.dispatch('applicants/getList') // @TODO lost current state?
    },

    getLatestInvitation(invitations) {
      if (invitations.length > 0) {
        const [latestInvitation] = invitations.slice(-1)

        if (latestInvitation.event) {
          return latestInvitation.event.event_name
        }

        return 'Pernah'
      }

      return 'Belum Pernah'
    },

    getPersonStatusText(value) {
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
  }
}
</script>
