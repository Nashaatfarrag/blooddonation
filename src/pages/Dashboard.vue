<template>
  <v-container class="py-6 py-md-10" dir="rtl">
    <v-row>
      <v-col cols="12">

        <!-- Hero header -->
        <div class="text-center mb-8">
          <v-avatar size="72" color="primary" class="mb-4 hero-icon">
            <v-icon size="36" color="white">mdi-chart-pie</v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">لوحة المعلومات</h1>
          <p class="text-body-1 text-grey mt-2">إحصائيات وتحليلات المتبرعين</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-16">
          <v-progress-circular indeterminate color="primary" size="56" width="5"></v-progress-circular>
          <p class="text-grey mt-4">جاري تحميل البيانات...</p>
        </div>

        <v-alert v-if="error" type="error" variant="tonal" border="start" class="mb-5" rounded="lg">
          {{ error }}
        </v-alert>

        <template v-if="!loading && !error">
          <!-- Summary Cards -->
          <v-row class="mb-8">
            <v-col cols="6" md="3">
              <v-card class="pa-5 text-center summary-card" variant="tonal" color="primary" rounded="xl">
                <v-icon size="36" color="primary" class="mb-2">mdi-account-group</v-icon>
                <div class="text-h4 font-weight-bold">{{ donors.length }}</div>
                <div class="text-body-2 text-grey-darken-1">إجمالي المتبرعين</div>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card class="pa-5 text-center summary-card" variant="tonal" color="success" rounded="xl">
                <v-icon size="36" color="success" class="mb-2">mdi-check-circle</v-icon>
                <div class="text-h4 font-weight-bold">{{ eligibleCount }}</div>
                <div class="text-body-2 text-grey-darken-1">مؤهلين للتبرع</div>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card class="pa-5 text-center summary-card" variant="tonal" color="info" rounded="xl">
                <v-icon size="36" color="info" class="mb-2">mdi-gender-male</v-icon>
                <div class="text-h4 font-weight-bold">{{ maleCount }}</div>
                <div class="text-body-2 text-grey-darken-1">ذكور</div>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card class="pa-5 text-center summary-card" variant="tonal" color="secondary" rounded="xl">
                <v-icon size="36" color="secondary" class="mb-2">mdi-gender-female</v-icon>
                <div class="text-h4 font-weight-bold">{{ femaleCount }}</div>
                <div class="text-body-2 text-grey-darken-1">إناث</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Charts Row -->
          <v-row class="mb-6">
            <!-- Blood Type Distribution -->
            <v-col cols="12" md="6">
              <v-card class="pa-6" rounded="xl">
                <div class="d-flex align-center mb-6">
                  <v-icon color="primary" class="me-2">mdi-water</v-icon>
                  <span class="text-subtitle-1 font-weight-bold">توزيع فصائل الدم</span>
                </div>
                <div class="chart-container">
                  <div 
                    v-for="(item, index) in bloodTypeStats" 
                    :key="item.type" 
                    class="chart-bar-row mb-3"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                  >
                    <div class="d-flex align-center justify-space-between mb-1">
                      <div class="d-flex align-center">
                        <v-chip :color="item.color" variant="flat" size="small" class="font-weight-bold me-2">
                          {{ item.type }}
                        </v-chip>
                        <span class="text-body-2 text-grey">{{ item.count }} متبرع</span>
                      </div>
                      <span class="text-body-2 font-weight-bold">{{ item.percentage }}%</span>
                    </div>
                    <div class="chart-bar-bg">
                      <div
                        class="chart-bar-fill"
                        :style="{ 
                          width: item.percentage + '%', 
                          backgroundColor: item.color,
                          animationDelay: `${index * 0.1}s`
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Gender Pie Chart (CSS) -->
            <v-col cols="12" md="6">
              <v-card class="pa-6" rounded="xl">
                <div class="d-flex align-center mb-6">
                  <v-icon color="primary" class="me-2">mdi-gender-male-female</v-icon>
                  <span class="text-subtitle-1 font-weight-bold">توزيع النوع</span>
                </div>
                <div class="d-flex justify-center mb-6">
                  <div 
                    class="pie-chart"
                    :style="{
                      background: `conic-gradient(
                        #1565C0 0deg ${maleAngle}deg,
                        #EF5350 ${maleAngle}deg 360deg
                      )`
                    }"
                  >
                    <div class="pie-inner">
                      <v-icon size="32" color="grey">mdi-account-group</v-icon>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-center ga-6">
                  <div class="d-flex align-center">
                    <div class="legend-dot" style="background: #1565C0"></div>
                    <span class="text-body-2">ذكور {{ malePercentage }}%</span>
                  </div>
                  <div class="d-flex align-center">
                    <div class="legend-dot" style="background: #EF5350"></div>
                    <span class="text-body-2">إناث {{ femalePercentage }}%</span>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Age Distribution -->
          <v-row class="mb-6">
            <v-col cols="12">
              <v-card class="pa-6" rounded="xl">
                <div class="d-flex align-center mb-6">
                  <v-icon color="primary" class="me-2">mdi-calendar-range</v-icon>
                  <span class="text-subtitle-1 font-weight-bold">توزيع الأعمار</span>
                </div>
                <v-row>
                  <v-col v-for="(group, index) in ageGroups" :key="group.label" cols="6" sm="4" md="2">
                    <div class="text-center age-column" :style="{ animationDelay: `${index * 0.1}s` }">
                      <div class="age-bar-container">
                        <div 
                          class="age-bar"
                          :style="{ 
                            height: group.percentage + '%',
                            background: `linear-gradient(180deg, ${group.color} 0%, ${group.colorDark} 100%)`
                          }"
                        ></div>
                      </div>
                      <div class="text-h6 font-weight-bold mt-2">{{ group.count }}</div>
                      <div class="text-caption text-grey">{{ group.label }}</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- Recent Donors -->
          <v-card class="pa-6" rounded="xl">
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="me-2">mdi-clock-outline</v-icon>
              <span class="text-subtitle-1 font-weight-bold">أحدث المتبرعين</span>
            </div>
            <v-list>
              <v-list-item 
                v-for="donor in recentDonors" 
                :key="donor._id"
                class="mb-1"
                rounded="lg"
              >
                <template v-slot:prepend>
                  <v-avatar size="40" :color="donor.basicInfo.gender === 'male' ? 'blue-lighten-4' : 'pink-lighten-4'">
                    <v-icon :color="donor.basicInfo.gender === 'male' ? 'info' : 'pink'" size="20">
                      {{ donor.basicInfo.gender === 'male' ? 'mdi-gender-male' : 'mdi-gender-female' }}
                    </v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ donor.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getColor(donor.bloodType)" size="x-small" variant="flat" class="font-weight-bold me-2">
                    {{ donor.bloodType }}
                  </v-chip>
                  {{ donor.basicInfo.gender === 'male' ? 'ذكر' : 'أنثى' }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn 
                    :href="`tel:${donor.contactInfo.tel}`" 
                    icon="mdi-phone" 
                    variant="tonal" 
                    color="success" 
                    size="small"
                    :aria-label="`اتصال بـ ${donor.name}`"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </template>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/utils/api'
import { getBloodTypeColor, BLOOD_TYPES, checkDonationEligibility, calculateAge } from '@/utils/bloodTypes'

export default {
  name: 'Dashboard',
  data() {
    return {
      donors: [],
      loading: true,
      error: null
    }
  },
  computed: {
    maleCount() {
      return this.donors.filter(d => d.basicInfo.gender === 'male').length
    },
    femaleCount() {
      return this.donors.filter(d => d.basicInfo.gender === 'female').length
    },
    malePercentage() {
      if (!this.donors.length) return 0
      return Math.round((this.maleCount / this.donors.length) * 100)
    },
    femalePercentage() {
      return 100 - this.malePercentage
    },
    maleAngle() {
      return Math.round((this.maleCount / (this.donors.length || 1)) * 360)
    },
    eligibleCount() {
      return this.donors.filter(d => {
        if (!d.donationDates || d.donationDates.length === 0) return true
        const lastItem = d.donationDates[d.donationDates.length - 1]
        const lastDate = lastItem.when || lastItem
        return checkDonationEligibility(lastDate).eligible
      }).length
    },
    bloodTypeStats() {
      const counts = {}
      this.donors.forEach(d => {
        counts[d.bloodType] = (counts[d.bloodType] || 0) + 1
      })
      return BLOOD_TYPES
        .map(type => ({
          type,
          count: counts[type] || 0,
          percentage: this.donors.length ? Math.round(((counts[type] || 0) / this.donors.length) * 100) : 0,
          color: getBloodTypeColor(type)
        }))
        .sort((a, b) => b.count - a.count)
    },
    ageGroups() {
      const ranges = [
        { label: '18-25', min: 18, max: 25, color: '#4CAF50', colorDark: '#2E7D32' },
        { label: '26-35', min: 26, max: 35, color: '#2196F3', colorDark: '#1565C0' },
        { label: '36-45', min: 36, max: 45, color: '#FF9800', colorDark: '#F57C00' },
        { label: '46-55', min: 46, max: 55, color: '#9C27B0', colorDark: '#7B1FA2' },
        { label: '56-65', min: 56, max: 65, color: '#F44336', colorDark: '#C62828' },
        { label: '65+', min: 66, max: 200, color: '#607D8B', colorDark: '#455A64' }
      ]
      
      const maxCount = Math.max(1, ...ranges.map(r => {
        return this.donors.filter(d => {
          const age = calculateAge(d.basicInfo.birthDate)
          return age >= r.min && age <= r.max
        }).length
      }))

      return ranges.map(r => {
        const count = this.donors.filter(d => {
          const age = calculateAge(d.basicInfo.birthDate)
          return age >= r.min && age <= r.max
        }).length
        return {
          ...r,
          count,
          percentage: Math.round((count / maxCount) * 100)
        }
      })
    },
    recentDonors() {
      return [...this.donors].slice(-5).reverse()
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
        const response = await api.get('/donor')
        this.donors = response.data
      } catch (err) {
        this.error = `فشل في تحميل البيانات: ${err.message}`
      } finally {
        this.loading = false
      }
    },
    getColor(type) {
      return getBloodTypeColor(type)
    }
  }
}
</script>

<style scoped>
.hero-icon {
  box-shadow: 0 8px 32px rgba(198, 40, 40, 0.3);
}

.summary-card {
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
}

/* Bar Chart */
.chart-bar-bg {
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.chart-bar-fill {
  height: 100%;
  border-radius: 5px;
  animation: barGrow 0.8s ease-out forwards;
  transform-origin: right;
}

@keyframes barGrow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.chart-bar-row {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pie Chart */
.pie-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  position: relative;
  transition: transform 0.3s ease;
}

.pie-chart:hover {
  transform: scale(1.05);
}

.pie-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgb(var(--v-theme-surface));
  display: flex;
  align-items: center;
  justify-content: center;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 8px;
}

/* Age Distribution */
.age-bar-container {
  height: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.age-bar {
  width: 40px;
  border-radius: 6px 6px 0 0;
  transition: height 0.8s ease-out;
  min-height: 4px;
}

.age-column {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}
</style>
