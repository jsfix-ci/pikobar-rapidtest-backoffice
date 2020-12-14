<template>
  <v-layout v-if="permissions.includes('list-applicants')">
    <applicants-datatable
      status="approved"
      :allow="permissions"
      sticky-actions
      @optionChanged="onOptionChange"
    />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { pickBy, identity } from 'lodash'
import ApplicantsDatatable from '@/components/ApplicantsDatatable'

export default {
  middleware: 'auth',
  components: {
    ApplicantsDatatable
  },

  computed: {
    ...mapGetters('auth', ['permissions'])
  },

  watch: {
    '$route.query': {
      handler(value, oldValue) {
        this.$store.dispatch(
          'applicants/getRecordsApproved',
          value.keyWords !== oldValue.keyWords || value.page !== oldValue.page
        )
      },
      deep: true
    }
  },

  created() {
    this.$store.dispatch('breadcrumbs/setItems', [
      {
        disabled: true,
        text: 'Daftar Peserta'
      }
    ])
  },

  methods: {
    onOptionChange(value) {
      let query = { ...this.$route.query }
      if (value.page) query.page = value.page
      query.perPage = value.itemsPerPage || null
      query.sortBy = value.sortBy.length > 0 ? value.sortBy[0] : null
      query.sortOrder = value.sortDesc[0] ? 'desc' : 'asc'
      query.city = value.city
      query.keyWords = value.keyWords
      query.sessionId = value.sessionId
      query.startDate = value.startDate
      query.endDate = value.endDate
      query.personStatus = value.personStatus
      query.sessionId = value.sessionId
      query = pickBy(query, identity)
      this.$router
        .replace({
          query
        })
        .catch(() => {})
    }
  },

  head() {
    return {
      title: 'Daftar Peserta'
    }
  }
}
</script>
