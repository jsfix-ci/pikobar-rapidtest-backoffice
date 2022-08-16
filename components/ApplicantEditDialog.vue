<template>
  <div>
    <v-dialog :value="open" persistent max-width="700">
      <v-card>
        <v-card-title>
          <span class="headline font-weight-medium pl-4 pt-4"
            >Edit Peserta Tes</span
          >
        </v-card-title>
        <v-card-text>
          <v-container>
            <div>
              <ValidationObserver ref="form">
                <v-text-field
                  v-model="registrationCode"
                  label="Nomor Pendaftaran"
                  filled
                  readonly
                  outlined
                  dense
                />
                <pkbr-input
                  v-if="isEditApplicant && nationality === 'WNI'"
                  v-model="nik"
                  name="NIK"
                  label="NIK Baru"
                  placeholder="Masukan NIK"
                  :clearable="false"
                  rules="required|nik"
                />
                <pkbr-input
                  v-if="isEditApplicant && nationality === 'WNA'"
                  v-model="nik"
                  name="Passport"
                  label="Passport"
                  placeholder="Masukan Passport"
                  :clearable="false"
                  rules="required|passport"
                />
                <pkbr-input
                  v-model="name"
                  name="Nama Peserta"
                  label="Nama Peserta"
                  placeholder="Masukan Nama Peserta"
                  :clearable="false"
                  rules="required"
                />
                <pkbr-select
                  v-model="gender"
                  :items="[
                    { text: 'Laki-Laki', value: 'M' },
                    { text: 'Perempuan', value: 'F' }
                  ]"
                  label="Jenis Kelamin"
                  name="Jenis Kelamin"
                  placeholder="Pilih Jenis Kelamin"
                  rules="required"
                  item-text="text"
                  item-value="value"
                />
                <pkbr-input
                  v-model="workPlace"
                  name="Instansi Tempat Bekerja"
                  label="Instansi Tempat Bekerja"
                  placeholder="Masukan Instansi Tempat Bekerja"
                  :clearable="false"
                  rules="required"
                />
                <pkbr-input
                  v-if="isEditApplicant"
                  v-model="phone_number"
                  name="Nomor Telepon"
                  label="Nomor Telepon"
                  placeholder="Masukan Nomor Telepon"
                  :clearable="false"
                  rules="required|phone_number"
                />
                <pkbr-select
                  v-if="isEditApplicant"
                  v-model="city_code"
                  :items="getKabkot"
                  label="Kab/Kota Tinggal Sekarang"
                  name="Kab/Kota Tinggal Sekarang"
                  placeholder="Pilih Kab/Kota Tinggal Sekarang"
                  rules="required"
                  item-text="name"
                  item-value="code"
                />
                <pkbr-input
                  v-if="isEditApplicant"
                  v-model="address"
                  name="Alamat Tempat Tinggal Sekarang"
                  label="Alamat Tempat Tinggal Sekarang"
                  placeholder="Masukan Alamat Tempat Tinggal Sekarang"
                  :clearable="false"
                  rules="required|max:150"
                />
                <pkbr-select
                  v-if="isEditApplicant"
                  v-model="status"
                  :items="statusOptions"
                  label="Status Kesehatan"
                  name="Status Kesehatan"
                  placeholder="Pilih Status Kesehatan"
                  rules="required"
                  item-text="text"
                  item-value="value"
                />
              </ValidationObserver>
            </div>
          </v-container>
        </v-card-text>

        <v-card-actions class="pb-8 mr-7 mt-n8 justify-end">
          <v-btn
            color="grey darken-1"
            outlined
            class="mr-2 px-2"
            @click="close"
          >
            Batal
          </v-btn>
          <v-btn color="primary" class="ml-2 px-2" @click="save">
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { STATUS_OPTIONS } from '@/utilities/constant'
import { ValidationObserver } from 'vee-validate'
import { mapGetters } from 'vuex'
export default {
  components: { ValidationObserver },
  props: {
    open: {
      type: Boolean,
      default: false
    },

    recordId: {
      type: Number,
      default: null
    },

    isEditApplicant: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      registrationCode: null,
      name: null,
      nik: null,
      gender: null,
      city_code: null,
      address: null,
      phone_number: null,
      status: null,
      workPlace: null,
      nationality: null,
      district_code: null,
      symptoms: null,
      village_code: null,
      birth_date: null
    }
  },

  computed: {
    ...mapGetters('area', ['getKabkot']),
    statusOptions() {
      return STATUS_OPTIONS
    }
  },

  watch: {
    recordId(value) {
      if (value) {
        this.fetchRecord()
      }
    }
  },

  methods: {
    async fetchRecord() {
      const id = this.recordId
      const { data } = await this.$axios.$get(`/rdt/applicants/${id}`)
      console.log(data)

      this.registrationCode = data.registration_code
      this.name = data.name
      this.nik = data.nik
      this.gender = data.gender
      this.city_code = data.city_code
      this.address = data.address
      this.phone_number = data.phone_number
      this.status = data.person_status
      this.workPlace = data.workplace_name
      this.nationality = data.nationality
      this.district_code = data.district_code
      this.symptoms = data.symptoms
      this.village_code = data.village_code
      this.birth_date = data.birth_date
    },

    async save() {
      const valid = await this.$refs.form.validate()
      if (valid) {
        const id = this.recordId

        try {
          await this.$axios.$put(`/rdt/applicants/${id}`, {
            name: this.name,
            gender: this.gender,
            nik: this.nik,
            city_code: this.city_code,
            address: this.address,
            phone_number: this.phone_number,
            person_status: this.status,
            workplace_name: this.workPlace,
            nationality: this.nationality,
            district_code: this.district_code,
            symptoms: this.symptoms,
            village_code: this.village_code,
            birth_date: this.birth_date
          })

          this.$emit('save')
        } catch (e) {
          throw new Error(e)
        }
      }
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>
