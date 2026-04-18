<template>
  <v-container class="py-6 py-md-10" dir="rtl">
    <v-row>
      <v-col cols="12">

        <!-- Hero header -->
        <div class="text-center mb-8">
          <v-avatar size="72" color="primary" class="mb-4 hero-icon">
            <v-icon size="36" color="white">mdi-account-group</v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">قائمة المتبرعين بتطاي</h1>
          <p class="text-body-1 text-grey mt-2">تصفح وابحث عن المتبرعين بالدم في قرية تطاي</p>
        </div>

        <!-- Skeleton Loaders -->
        <div v-if="loading">
          <v-card class="mb-6 pa-5">
            <v-skeleton-loader type="heading" class="mb-4"></v-skeleton-loader>
            <v-row>
              <v-col cols="12" sm="4" v-for="i in 3" :key="i">
                <v-skeleton-loader type="text"></v-skeleton-loader>
              </v-col>
            </v-row>
          </v-card>
          <v-row class="mb-6">
            <v-col cols="6" sm="3" v-for="i in 4" :key="i">
              <v-skeleton-loader type="card" height="80"></v-skeleton-loader>
            </v-col>
          </v-row>
          <v-card>
            <v-skeleton-loader type="table-heading, table-row@5"></v-skeleton-loader>
          </v-card>
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
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="searchName"
                label="بحث بالاسم"
                prepend-inner-icon="mdi-magnify"
                clearable
                @update:model-value="applyFilters"
                hide-details
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filterBloodType"
                :items="bloodTypeOptions"
                label="فئة الدم"
                prepend-inner-icon="mdi-water-outline"
                clearable
                @update:model-value="applyFilters"
                hide-details
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filterAgeRange"
                :items="ageRangeOptions"
                label="نطاق العمر"
                prepend-inner-icon="mdi-calendar-range"
                clearable
                @update:model-value="applyFilters"
                hide-details
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn block @click="resetFilters" variant="tonal" color="grey" rounded="lg" size="large">
                <v-icon start>mdi-filter-remove</v-icon>
                إعادة تعيين
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Stats bar with animated counters -->
        <v-row v-if="!loading && filteredDonors.length > 0" class="mb-6">
          <v-col cols="6" sm="3">
            <v-card class="pa-4 text-center stat-card" variant="tonal" color="primary">
              <div class="text-h5 font-weight-bold">{{ animatedStats.total }}</div>
              <div class="text-caption text-grey-darken-1">إجمالي المتبرعين</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="pa-4 text-center stat-card" variant="tonal" color="info">
              <div class="text-h5 font-weight-bold">{{ animatedStats.bloodTypes }}</div>
              <div class="text-caption text-grey-darken-1">فصائل الدم</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="pa-4 text-center stat-card" variant="tonal" color="success">
              <div class="text-h5 font-weight-bold">{{ animatedStats.males }}</div>
              <div class="text-caption text-grey-darken-1">ذكور</div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="pa-4 text-center stat-card" variant="tonal" color="secondary">
              <div class="text-h5 font-weight-bold">{{ animatedStats.females }}</div>
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
                  <th class="text-subtitle-2 font-weight-bold">آخر تبرع</th>
                  <th class="text-subtitle-2 font-weight-bold">التبرعات</th>
                  <th class="text-subtitle-2 font-weight-bold">الاتصال</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="donor in paginatedDonors" :key="donor._id" class="table-row">
                  <td class="font-weight-medium">{{ donor.name }}</td>
                  <td>
                    <v-chip :color="getColor(donor.bloodType)" variant="flat" size="small" class="font-weight-bold">
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
                    <template v-if="getLastDonation(donor)">
                      <v-chip 
                        :color="getDonationEligibility(donor).eligible ? 'success' : 'warning'" 
                        variant="tonal" 
                        size="small"
                      >
                        <v-icon start size="14">
                          {{ getDonationEligibility(donor).eligible ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                        </v-icon>
                        {{ formatDate(getLastDonation(donor)) }}
                      </v-chip>
                      <div v-if="!getDonationEligibility(donor).eligible" class="text-caption text-grey mt-1">
                        متبقي {{ getDonationEligibility(donor).daysRemaining }} يوم
                      </div>
                    </template>
                    <span v-else class="text-grey">-</span>
                  </td>
                  <td>
                    <v-chip v-if="donor.donationDates && donor.donationDates.length > 0" color="success" variant="tonal" size="small">
                      <v-icon start size="14">mdi-heart-pulse</v-icon>
                      {{ donor.donationDates.length }}
                    </v-chip>
                    <span v-else class="text-grey">-</span>
                  </td>
                  <td>
                    <div class="d-flex ga-1">
                      <v-btn
                        :href="`tel:${donor.contactInfo.tel}`"
                        @click="logContact(donor.name, 'Phone')"
                        icon="mdi-phone"
                        size="small"
                        variant="tonal"
                        color="success"
                        :aria-label="`اتصال بـ ${donor.name}`"
                      ></v-btn>
                      <v-btn
                        :href="`https://wa.me/${formatWhatsApp(donor.contactInfo.tel)}`"
                        target="_blank"
                        @click="logContact(donor.name, 'WhatsApp')"
                        icon="mdi-whatsapp"
                        size="small"
                        variant="tonal"
                        color="green"
                        :aria-label="`واتساب ${donor.name}`"
                      ></v-btn>
                    </div>
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
                  <v-chip :color="getColor(donor.bloodType)" variant="flat" size="small" class="ms-2 font-weight-bold">
                    {{ donor.bloodType }}
                  </v-chip>
                </div>
              </v-card-item>
              
              <v-divider class="my-3"></v-divider>
              
              <v-card-text class="pa-0">
                <v-row no-gutters class="mb-3">
                  <v-col cols="4">
                    <div class="text-caption font-weight-bold text-grey">النوع</div>
                    <div class="text-body-2">{{ donor.basicInfo.gender === 'male' ? 'ذكر' : 'أنثى' }}</div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-caption font-weight-bold text-grey">التبرعات</div>
                    <div class="text-body-2">
                      <v-chip v-if="donor.donationDates && donor.donationDates.length > 0" color="success" variant="tonal" size="x-small">
                        {{ donor.donationDates.length }}
                      </v-chip>
                      <span v-else>-</span>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-caption font-weight-bold text-grey">آخر تبرع</div>
                    <div class="text-body-2">
                      <v-chip 
                        v-if="getLastDonation(donor)"
                        :color="getDonationEligibility(donor).eligible ? 'success' : 'warning'" 
                        variant="tonal" 
                        size="x-small"
                      >
                        {{ getDonationEligibility(donor).eligible ? 'مؤهل' : `${getDonationEligibility(donor).daysRemaining} يوم` }}
                      </v-chip>
                      <span v-else>-</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              
              <div class="d-flex ga-2">
                <v-btn
                  :href="`tel:${donor.contactInfo.tel}`"
                  @click="logContact(donor.name, 'Phone')"
                  flex-grow-1
                  prepend-icon="mdi-phone"
                  color="success"
                  variant="tonal"
                  rounded="lg"
                >
                  اتصال
                </v-btn>
                <v-btn
                  :href="`https://wa.me/${formatWhatsApp(donor.contactInfo.tel)}`"
                  target="_blank"
                  @click="logContact(donor.name, 'WhatsApp')"
                  flex-grow-1
                  prepend-icon="mdi-whatsapp"
                  color="green"
                  variant="tonal"
                  rounded="lg"
                >
                  واتساب
                </v-btn>
              </div>
            </v-card>
          </div>
          
          <!-- Empty state -->
          <v-card-text v-if="filteredDonors.length === 0" class="text-center py-12">
            <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-account-search-outline</v-icon>
            <p class="text-h6 text-grey">لم يتم العثور على متبرعين</p>
            <p class="text-body-2 text-grey-lighten-1 mb-4">جرب تعديل الفلاتر أو البحث بكلمات مختلفة</p>
            <v-btn variant="tonal" color="primary" @click="resetFilters" prepend-icon="mdi-filter-remove">
              إعادة تعيين الفلاتر
            </v-btn>
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
import api from '@/utils/api'
import { logAudit } from '@/utils/auth'
import { getBloodTypeColor, BLOOD_TYPE_OPTIONS, checkDonationEligibility, calculateAge } from '@/utils/bloodTypes'

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
      searchName: '',
      filterBloodType: null,
      filterAgeRange: null,
      bloodTypeOptions: BLOOD_TYPE_OPTIONS,
      ageRangeOptions: [
        { title: '18-25 سنة', value: '18-25' },
        { title: '26-35 سنة', value: '26-35' },
        { title: '36-45 سنة', value: '36-45' },
        { title: '46-55 سنة', value: '46-55' },
        { title: '56+ سنة', value: '56+' }
      ],
      animatedStats: { total: 0, bloodTypes: 0, males: 0, females: 0 }
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
    logContact(donorName, method) {
      logAudit('CONTACT_DONOR', `قام بمحاولة التواصل مع المتبرع ${donorName} عبر ${method}`)
    },
    async fetchDonors() {
      try {
        this.loading = true
        this.error = null
        const response = await api.get('/donor')
        this.donors = response.data
        this.applyFilters()
        this.$nextTick(() => this.animateStats())
      } catch (err) {
        this.error = `فشل في تحميل البيانات: ${err.message}`
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      this.filteredDonors = this.donors.filter(donor => {
        let matches = true

        if (this.searchName) {
          matches = donor.name.toLowerCase().includes(this.searchName.toLowerCase())
        }

        if (matches && this.filterBloodType) {
          matches = donor.bloodType === this.filterBloodType
        }

        if (matches && this.filterAgeRange) {
          const age = calculateAge(donor.basicInfo.birthDate)
          const [minAge, maxAge] = this.parseAgeRange(this.filterAgeRange)
          matches = age >= minAge && age <= maxAge
        }

        return matches
      })
      this.currentPage = 1
    },
    resetFilters() {
      this.searchName = ''
      this.filterBloodType = null
      this.filterAgeRange = null
      this.applyFilters()
    },
    parseAgeRange(range) {
      if (range === '18-25') return [18, 25]
      if (range === '26-35') return [26, 35]
      if (range === '36-45') return [36, 45]
      if (range === '46-55') return [46, 55]
      if (range === '56+') return [56, 150]
      return [0, 150]
    },
    parseDate(date) {
      if (!date) return null
      // Handle MongoDB $date objects
      if (typeof date === 'object' && date.$date) {
        date = date.$date
      }
      const parsed = new Date(date)
      // Validate the parsed date
      if (isNaN(parsed.getTime())) return null
      return parsed
    },
    formatDate(date) {
      const parsed = this.parseDate(date)
      if (!parsed) return '-'
      return parsed.toLocaleDateString('ar-EG')
    },
    getColor(bloodType) {
      return getBloodTypeColor(bloodType)
    },
    getLastDonation(donor) {
      if (!donor.donationDates || donor.donationDates.length === 0) return null
      const lastRaw = donor.donationDates[donor.donationDates.length - 1]
      // Validate the date is parseable
      const parsed = this.parseDate(lastRaw)
      return parsed ? lastRaw : null
    },
    getDonationEligibility(donor) {
      const lastRaw = this.getLastDonation(donor)
      if (!lastRaw) return { eligible: true, daysRemaining: 0 }
      const parsed = this.parseDate(lastRaw)
      if (!parsed) return { eligible: true, daysRemaining: 0 }
      return checkDonationEligibility(parsed)
    },
    formatWhatsApp(phone) {
      if (!phone) return ''
      // Remove leading 0, add Egypt country code
      let cleaned = phone.replace(/\D/g, '')
      if (cleaned.startsWith('0')) {
        cleaned = '2' + cleaned
      }
      if (!cleaned.startsWith('20')) {
        cleaned = '20' + cleaned
      }
      return cleaned
    },
    animateStats() {
      const targets = {
        total: this.filteredDonors.length,
        bloodTypes: this.uniqueBloodTypes,
        males: this.maleCount,
        females: this.femaleCount
      }
      const duration = 800
      const startTime = performance.now()
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        
        this.animatedStats = {
          total: Math.round(targets.total * eased),
          bloodTypes: Math.round(targets.bloodTypes * eased),
          males: Math.round(targets.males * eased),
          females: Math.round(targets.females * eased)
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
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