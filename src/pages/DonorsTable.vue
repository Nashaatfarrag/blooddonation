<template>
  <v-container class="py-6 py-md-10" dir="rtl">
    <v-row>
      <v-col cols="12">

        <!-- Hero header -->
        <div class="text-center mb-8">
          <v-avatar size="72" color="primary" class="mb-4 hero-icon">
            <v-icon size="36" color="white">mdi-account-group</v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">قائمة المتبرعين</h1>
          <p class="text-body-1 text-grey mt-2">تصفح وابحث عن المتبرعين بالدم</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-16">
          <v-progress-circular indeterminate color="primary" size="56" width="5"></v-progress-circular>
          <p class="text-grey mt-4">جاري تحميل البيانات...</p>
        </div>
        
        <v-alert v-if="error" type="error" variant="tonal" border="start" class="mb-5" rounded="lg">
          {{ error }}
        </v-alert>
        
        <!-- Filters -->
        <v-card v-if="!loading" class="mb-6 pa-5 filter-card">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="me-2">mdi-filter-variant</v-icon>
            <span class="text-subtitle-1 font-weight-bold text-grey-darken-2">تصفية النتائج</span>
          </div>
          <v-row align="center">
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="filterBloodType"
                :items="bloodTypeOptions"
                label="فئة الدم"
                prepend-inner-icon="mdi-water-outline"
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
                prepend-inner-icon="mdi-calendar-range"
                clearable
                @update:model-value="applyFilters"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn block @click="resetFilters" variant="tonal" color="grey" rounded="lg" size="large">
                <v-icon start>mdi-filter-remove</v-icon>
                إعادة تعيين
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Stats bar -->
        <v-row v-if="!loading && filteredDonors.length > 0" class="mb-6">
          <v-col cols="6" sm="3">
            <v-card class="pa-4 text-center stat-card" variant="tonal" color="primary">
              <div class="text-h5 font-weight-bold">{{ filteredDonors.length }}</div>
              <div class="text-caption text-grey-darken-1">إجمالي المتبرعين</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="pa-4 text-center stat-card" variant="tonal" color="info">
              <div class="text-h5 font-weight-bold">{{ uniqueBloodTypes }}</div>
              <div class="text-caption text-grey-darken-1">فصائل الدم</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="pa-4 text-center stat-card" variant="tonal" color="success">
              <div class="text-h5 font-weight-bold">{{ maleCount }}</div>
              <div class="text-caption text-grey-darken-1">ذكور</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="pa-4 text-center stat-card" variant="tonal" color="secondary">
              <div class="text-h5 font-weight-bold">{{ femaleCount }}</div>
              <div class="text-caption text-grey-darken-1">إناث</div>
            </v-card>
          </v-col>
        </v-row>
        
        <v-card v-if="!loading" class="table-card">
          <!-- Desktop Table -->
          <div class="d-none d-sm-block">
            <v-table hover>
              <thead>
                <tr class="table-header">
                  <th class="text-subtitle-2 font-weight-bold">الاسم</th>
                  <th class="text-subtitle-2 font-weight-bold">فئة الدم</th>
                  <th class="text-subtitle-2 font-weight-bold">النوع</th>
                  <th class="text-subtitle-2 font-weight-bold">الاتصال</th>
                  <th class="text-subtitle-2 font-weight-bold">التبرعات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="donor in paginatedDonors" :key="donor._id" class="table-row">
                  <td class="font-weight-medium">{{ donor.name }}</td>
                  <td>
                    <v-chip :color="getBloodTypeColor(donor.bloodType)" variant="flat" size="small" class="font-weight-bold">
                      {{ donor.bloodType }}
                    </v-chip>
                  </td>
                  <td>
                    <v-icon size="18" class="me-1" :color="donor.basicInfo.gender === 'male' ? 'info' : 'pink'">
                      {{ donor.basicInfo.gender === 'male' ? 'mdi-gender-male' : 'mdi-gender-female' }}
                    </v-icon>
                    {{ donor.basicInfo.gender === 'male' ? 'ذكر' : 'أنثى' }}
                  </td>
                  <td>
                    <v-btn
                      :href="`tel:${donor.contactInfo.tel}`"
                      icon="mdi-phone"
                      size="small"
                      variant="tonal"
                      color="success"
                      :title="donor.contactInfo.tel"
                    ></v-btn>
                  </td>
                  <td>
                    <v-chip v-if="donor.donationDates && donor.donationDates.length > 0" color="success" variant="tonal" size="small">
                      <v-icon start size="14">mdi-heart-pulse</v-icon>
                      {{ donor.donationDates.length }}
                    </v-chip>
                    <span v-else class="text-grey">-</span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          
          <!-- Mobile Cards -->
          <div class="d-sm-none pa-4">
            <v-card 
              v-for="donor in paginatedDonors" 
              :key="donor._id" 
              class="mb-4 pa-4 mobile-donor-card" 
              rounded="xl" 
              elevation="1"
              border
            >
              <v-card-item>
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center flex-grow-1">
                    <v-avatar size="40" :color="donor.basicInfo.gender === 'male' ? 'blue-lighten-4' : 'pink-lighten-4'" class="me-3">
                      <v-icon :color="donor.basicInfo.gender === 'male' ? 'info' : 'pink'">
                        {{ donor.basicInfo.gender === 'male' ? 'mdi-gender-male' : 'mdi-gender-female' }}
                      </v-icon>
                    </v-avatar>
                    <v-card-title class="pa-0 text-body-1 font-weight-bold">
                      {{ donor.name }}
                    </v-card-title>
                  </div>
                  <v-chip :color="getBloodTypeColor(donor.bloodType)" variant="flat" size="small" class="ms-2 font-weight-bold">
                    {{ donor.bloodType }}
                  </v-chip>
                </div>
              </v-card-item>
              
              <v-divider class="my-3"></v-divider>
              
              <v-card-text class="pa-0">
                <v-row no-gutters class="mb-3">
                  <v-col cols="6" class="pe-2">
                    <div class="text-caption font-weight-bold text-grey">النوع</div>
                    <div class="text-body-2">{{ donor.basicInfo.gender === 'male' ? 'ذكر' : 'أنثى' }}</div>
                  </v-col>
                  <v-col cols="6" class="ps-2">
                    <div class="text-caption font-weight-bold text-grey">التبرعات</div>
                    <div class="text-body-2">
                      <v-chip v-if="donor.donationDates && donor.donationDates.length > 0" color="success" variant="tonal" size="x-small">
                        {{ donor.donationDates.length }}
                      </v-chip>
                      <span v-else>-</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              
              <v-btn
                :href="`tel:${donor.contactInfo.tel}`"
                block
                prepend-icon="mdi-phone"
                color="success"
                variant="tonal"
                rounded="lg"
              >
                {{ donor.contactInfo.tel }}
              </v-btn>
            </v-card>
          </div>
          
          <v-card-text v-if="filteredDonors.length === 0" class="text-center py-12">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-search</v-icon>
            <p class="text-h6 text-grey">لم يتم العثور على متبرعين</p>
            <p class="text-body-2 text-grey-lighten-1">جرب تعديل الفلاتر للحصول على نتائج</p>
          </v-card-text>
          
          <!-- Pagination -->
          <div v-if="filteredDonors.length > 0" class="d-flex justify-center pa-6">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="5"
              rounded="lg"
              active-color="primary"
            ></v-pagination>
          </div>
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
    },
    uniqueBloodTypes() {
      return new Set(this.filteredDonors.map(d => d.bloodType)).size
    },
    maleCount() {
      return this.filteredDonors.filter(d => d.basicInfo.gender === 'male').length
    },
    femaleCount() {
      return this.filteredDonors.filter(d => d.basicInfo.gender === 'female').length
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

<style scoped>
.hero-icon {
  box-shadow: 0 8px 32px rgba(198, 40, 40, 0.3);
}

.filter-card {
  border-right: 4px solid #C62828;
}

.stat-card {
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.table-card {
  overflow: hidden;
}

.table-header {
  background: #fef2f2 !important;
}

.table-row {
  transition: background-color 0.2s ease;
}

.mobile-donor-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mobile-donor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>