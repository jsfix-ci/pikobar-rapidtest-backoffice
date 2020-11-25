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
          <v-col cols="3">
            <v-text-field
              v-model="listQuery.nameNik"
              label="NIK/Nama Peserta / Nomor Pendaftaran"
              placeholder="NIK/Nama Peserta / Nomor Pendaftaran"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col cols="3">
            <pkbr-select
              v-model="listQuery.city"
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
          <v-col cols="2">
            <v-btn color="primary" @click="searchFilter">
              Cari
            </v-btn>
            <v-btn color="primary" @click="doFilterReset">
              Reset
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col v-if="false" cols="auto">
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
      <template v-slot:[`item.age`]="{ item }">
        <v-layout justify-center>
          {{ item.age }}
        </v-layout>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <v-layout justify-start>
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

    <applicant-delete-dialog
      :open="deleteDialog"
      :record="selectedData"
      @close="deleteClose"
      @remove="remove"
    />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import { mapGetters } from 'vuex'
import { getPersonStatusText } from '@/utilities/personStatus'
import ApplicantCreateDialog from '@/components/ApplicantCreateDialog'
import ApplicantEditDialog from '@/components/ApplicantEditDialog'
import ApplicantViewDialog from '@/components/ApplicantViewDialog'
import ApplicantDeleteDialog from '@/components/ApplicantDeleteDialog'
import {
  SUCCESS_DELETE,
  FAILED_DELETE,
  CONFIRM_DELETE_PARTICIPANTS
} from '@/utilities/constant'

const headers = [
  { text: 'NIK', value: 'nik', width: 200 },
  { text: 'Nama Peserta', value: 'name', width: 200 },
  { text: 'Jenis Kelamin', value: 'gender', width: 130 },
  {
    text: 'Usia (Thn)',
    value: 'age',
    width: 120,
    align: 'center'
  },
  { text: 'Kota/Kab', value: 'city.name', sortable: false, width: 200 },
  {
    text: 'Riwayat Kontak',
    value: 'symptoms_interaction',
    width: 150,
    align: 'center'
  },
  { text: 'Tanggal Terdaftar', value: 'created_at', width: 200 },
  { text: 'Actions', value: 'actions', sortable: false, width: 150 }
]

export default {
  components: {
    ApplicantCreateDialog,
    ApplicantViewDialog,
    ApplicantEditDialog,
    ApplicantDeleteDialog
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
    },
    listType: {
      type: String,
      default: 'participant'
    }
  },

  data() {
    return {
      tempValue: this.value,
      createDialog: false,
      editDialog: false,
      deleteDialog: false,
      editRecordId: null,
      viewDialog: false,
      viewRecordId: null,
      selectedData: null,
      listQuery: {
        nameNik: null,
        city: null
      },
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
    confirmDeleteMsg() {
      return CONFIRM_DELETE_PARTICIPANTS
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
    this.options = options
    this.$emit('optionChanged', options)
    this.doFilterReset()
  },

  methods: {
    getPersonStatusText,
    async searchFilter() {
      await this.$store.dispatch('applicants/resetOptions')
      this.options = {
        ...this.options,
        keyWords: this.listQuery.nameNik,
        city: this.listQuery.city
      }
    },
    async doFilterReset() {
      Object.assign(this.$data.listQuery, this.$options.data().listQuery)
      await this.$store.dispatch('applicants/resetOptions')
      this.options = {
        ...this.options,
        keyWords: null,
        city: null
      }
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
      this.deleteDialog = true
      this.selectedData = item
    },

    deleteClose(payload) {
      this.deleteDialog = false
    },

    async remove(payload) {
      try {
        this.deleteDialog = false
        await this.$store.dispatch('applicants/delete', payload.id)
        this.$toast.show({
          message: SUCCESS_DELETE,
          type: 'success'
        })
        if (this.listType === 'applicant') {
          await this.$store.dispatch('applicants/getRecordsNew')
        } else {
          await this.$store.dispatch('applicants/getRecordsApproved')
        }
      } catch (error) {
        this.$toast.show({
          message: error.message || FAILED_DELETE,
          type: 'error'
        })
      }
    },

    editClose() {
      this.editDialog = false
      this.editRecordId = null
    },

    async editSave() {
      this.editClose()
      if (this.listType === 'applicant') {
        await this.$store.dispatch('applicants/getRecordsNew')
      } else {
        await this.$store.dispatch('applicants/getRecordsApproved')
      }
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
    }
  }
}
</script>
