<template>
  <v-container class="py-4 py-md-8" dir="rtl">
    <v-row>
      <v-col cols="12">

        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        
        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>
        
        <!-- Filters -->
        <v-card v-if="!loading" class="mb-6 pa-4">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="filterBloodType"
                :items="bloodTypeOptions"
                label="فئة الدم"
                variant="outlined"
                clearable
                @update:model-value="applyFilters"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="filterAgeRange"
                :items="ageRangeOptions"
                label="نطاق العمر"
                variant="outlined"
                clearable
                @update:model-value="applyFilters"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn block @click="resetFilters" variant="outlined">
                إعادة تعيين الفلاتر
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        
        <v-card v-if="!loading">
          <!-- Desktop Table -->
          <div class="d-none d-sm-block">
            <v-table hover>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>فئة الدم</th>
                  <th>النوع</th>
                  <th>الاتصال</th>
                  <th>التبرعات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="donor in paginatedDonors" :key="donor._id">
                  <td>{{ donor.name }}</td>
                  <td>
                    <v-chip :color="getBloodTypeColor(donor.bloodType)">
                      {{ donor.bloodType }}
                    </v-chip>
                  </td>
                  <td>{{ donor.basicInfo.gender === 'male' ? 'ذكر' : 'أنثى' }}</td>
                  <td>
                    <v-btn
                      :href="`tel:${donor.contactInfo.tel}`"
                      icon="mdi-phone"
                      size="small"
                      variant="text"
                      :title="donor.contactInfo.tel"
                    ></v-btn>
                  </td>
                  <td>
                    <v-chip v-if="donor.donationDates && donor.donationDates.length > 0">
                      {{ donor.donationDates.length }}
                    </v-chip>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          
          <!-- Mobile Cards -->
          <div class="d-sm-none pa-3">
            <v-card v-for="donor in paginatedDonors" :key="donor._id" class="mb-4 pa-4" rounded="lg" elevation="2">
              <v-card-item>
                <div class="d-flex align-center justify-space-between">
                  <div class="flex-grow-1">
                    <v-card-title class="pa-0 text-body1 font-weight-bold">
                      {{ donor.name }}
                    </v-card-title>
                  </div>
                  <v-chip :color="getBloodTypeColor(donor.bloodType)" class="ms-2">
                    {{ donor.bloodType }}
                  </v-chip>
                </div>
              </v-card-item>
              
              <v-divider class="my-3"></v-divider>
              
              <v-card-text class="pa-0">
                <v-row no-gutters class="mb-3">
                  <v-col cols="6" class="pe-2">
                    <div class="text-caption font-weight-bold text-disabled">النوع</div>
                    <div class="text-body2">{{ donor.basicInfo.gender === 'male' ? 'ذكر' : 'أنثى' }}</div>
                  </v-col>
                  <v-col cols="6" class="ps-2">
                    <div class="text-caption font-weight-bold text-disabled">التبرعات</div>
                    <div class="text-body2">
                      <span v-if="donor.donationDates && donor.donationDates.length > 0">
                        {{ donor.donationDates.length }}
                      </span>
                      <span v-else>-</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              
              <v-divider class="my-3"></v-divider>
              
              <v-btn
                :href="`tel:${donor.contactInfo.tel}`"
                block
                prepend-icon="mdi-phone"
                color="primary"
                variant="tonal"
                rounded="md"
              >
                {{ donor.contactInfo.tel }}
              </v-btn>
            </v-card>
          </div>
          
          <v-card-text v-if="filteredDonors.length === 0" class="text-center py-8">
            <p>لم يتم العثور على متبرعين</p>
          </v-card-text>
          
          <!-- Pagination -->
          <v-row v-if="filteredDonors.length > 0" class="pa-6 justify-center">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="6"
            ></v-pagination>
          </v-row>
          
          <v-card-text class="text-center">
            <small>إجمالي المتبرعين: {{ filteredDonors.length }}</small>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

const API_URL = 'https://blooddonation-api-983366835228.europe-west9.run.app'
const ITEMS_PER_PAGE = 10

export default {
  name: 'DonorsTable',
  data() {
    return {
      donors: [],
      filteredDonors: [],
      loading: true,
      error: null,
      currentPage: 1,
      filterBloodType: null,
      filterAgeRange: null,
      bloodTypeOptions: [
        { title: 'O+', value: 'O+' },
        { title: 'O-', value: 'O-' },
        { title: 'A+', value: 'A+' },
        { title: 'A-', value: 'A-' },
        { title: 'B+', value: 'B+' },
        { title: 'B-', value: 'B-' },
        { title: 'AB+', value: 'AB+' },
        { title: 'AB-', value: 'AB-' }
      ],
      ageRangeOptions: [
        { title: '18-25 سنة', value: '18-25' },
        { title: '26-35 سنة', value: '26-35' },
        { title: '36-45 سنة', value: '36-45' },
        { title: '46-55 سنة', value: '46-55' },
        { title: '56+ سنة', value: '56+' }
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredDonors.length / ITEMS_PER_PAGE)
    },
    paginatedDonors() {
      const start = (this.currentPage - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE
      return this.filteredDonors.slice(start, end)
    }
  },
  mounted() {
    this.fetchDonors()
  },
  methods: {
    async fetchDonors() {
      try {
        this.loading = true
        this.error = null
        const response = await axios.get(`${API_URL}/donor`)
        this.donors = response.data
        this.applyFilters()
      } catch (err) {
        this.error = `فشل في تحميل البيانات: ${err.message}`
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      this.filteredDonors = this.donors.filter(donor => {
        let matchesBloodType = true
        let matchesAge = true

        if (this.filterBloodType) {
          matchesBloodType = donor.bloodType === this.filterBloodType
        }

        if (this.filterAgeRange) {
          const age = this.calculateAge(donor.basicInfo.birthDate)
          const [minAge, maxAge] = this.parseAgeRange(this.filterAgeRange)
          matchesAge = age >= minAge && age <= maxAge
        }

        return matchesBloodType && matchesAge
      })
      this.currentPage = 1
    },
    resetFilters() {
      this.filterBloodType = null
      this.filterAgeRange = null
      this.applyFilters()
    },
    calculateAge(birthDate) {
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age
    },
    parseAgeRange(range) {
      if (range === '18-25') return [18, 25]
      if (range === '26-35') return [26, 35]
      if (range === '36-45') return [36, 45]
      if (range === '46-55') return [46, 55]
      if (range === '56+') return [56, 150]
      return [0, 150]
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('ar-EG')
    },
    getBloodTypeColor(bloodType) {
      const colors = {
        'O+': '#FF6B6B',
        'O-': '#FFA07A',
        'A+': '#4ECDC4',
        'A-': '#45B7D1',
        'B+': '#F7DC6F',
        'B-': '#F39C12',
        'AB+': '#BB8FCE',
        'AB-': '#9B59B6'
      }
      return colors[bloodType] || '#95A5A6'
    }
  }
}
</script>