<template>
  <v-container class="py-6 py-md-10" dir="rtl">
    <v-row>
      <v-col cols="12">

        <!-- Hero header -->
        <div class="text-center mb-8">
          <v-avatar size="72" color="primary" class="mb-4 hero-icon">
            <v-icon size="36" color="white">mdi-doctor</v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">دليل الأطباء</h1>
          <p class="text-body-1 text-grey mt-2">
            {{ totalDoctors }} طبيب في {{ specialties.length }} تخصص
          </p>
        </div>

        <!-- Tabs: Show Favorites Toggle -->
        <div class="d-flex justify-center mb-4">
          <v-btn-toggle v-model="viewMode" mandatory rounded="lg" color="primary" density="compact">
            <v-btn value="all" prepend-icon="mdi-view-list" size="small">جميع الأطباء</v-btn>
            <v-btn value="favorites" prepend-icon="mdi-heart" size="small">
              المفضلة ({{ favoriteCount }})
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Search & Filters -->
        <v-card class="mb-6 pa-5 filter-card">
          <v-row align="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="searchQuery"
                label="بحث بالاسم أو العنوان"
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6" sm="3" md="2.5">
              <v-select
                v-model="filterSpecialty"
                :items="specialtyOptions"
                label="التخصص"
                prepend-inner-icon="mdi-stethoscope"
                clearable
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="6" sm="3" md="2.5">
              <v-select
                v-model="filterLocation"
                :items="locationOptions"
                label="المنطقة"
                prepend-inner-icon="mdi-map-marker"
                clearable
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn block @click="resetFilters" variant="tonal" color="grey" rounded="lg" size="large">
                <v-icon start>mdi-filter-remove</v-icon>
                إعادة تعيين
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Specialty sections -->
        <div v-for="specialty in displayedSpecialties" :key="specialty.name" class="mb-8">
          <div class="d-flex align-center mb-4">
            <v-avatar size="40" :color="specialty.color" class="me-3">
              <v-icon color="white" size="22">{{ specialty.icon }}</v-icon>
            </v-avatar>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3">{{ specialty.name }}</h2>
            <v-chip class="ms-3" size="small" variant="tonal" :color="specialty.color">
              {{ specialty.doctors.length }}
            </v-chip>
          </div>

          <v-row>
            <v-col 
              v-for="doctor in specialty.doctors" 
              :key="doctor.name" 
              cols="12" 
              sm="6" 
              md="4"
            >
              <v-card class="doctor-card h-100" rounded="xl" elevation="1" border>
                <v-card-item>
                  <div class="d-flex align-center">
                    <v-avatar size="44" :color="specialty.color" variant="tonal" class="me-3">
                      <v-icon :color="specialty.color">mdi-account</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <v-card-title class="pa-0 text-body-1 font-weight-bold">
                        {{ doctor.name }}
                      </v-card-title>
                      <v-chip size="x-small" :color="specialty.color" variant="tonal" class="mt-1">
                        {{ specialty.name }}
                      </v-chip>
                    </div>
                    <v-btn 
                      icon 
                      variant="text" 
                      size="small"
                      @click="toggleFavorite(doctor.name)"
                      :color="isFavorite(doctor.name) ? 'red' : 'grey'"
                      :aria-label="isFavorite(doctor.name) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'"
                    >
                      <v-icon>{{ isFavorite(doctor.name) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                    </v-btn>
                  </div>
                </v-card-item>

                <v-divider class="mx-4"></v-divider>

                <v-card-text class="pb-2">
                  <div v-if="doctor.address" class="d-flex align-start mb-2">
                    <v-icon size="18" color="grey" class="me-2 mt-1 flex-shrink-0">mdi-map-marker</v-icon>
                    <span class="text-body-2">{{ doctor.address }}</span>
                  </div>
                  <div v-if="doctor.schedule" class="d-flex align-start mb-2">
                    <v-icon size="18" color="grey" class="me-2 mt-1 flex-shrink-0">mdi-clock-outline</v-icon>
                    <span class="text-body-2">{{ doctor.schedule }}</span>
                  </div>
                  <div v-if="doctor.location" class="d-flex align-start mb-2">
                    <v-icon size="18" color="grey" class="me-2 mt-1 flex-shrink-0">mdi-map</v-icon>
                    <v-chip size="x-small" variant="tonal" color="grey">{{ doctor.location }}</v-chip>
                  </div>
                </v-card-text>

                <v-card-actions class="px-4 pb-4 pt-0 flex-wrap">
                  <v-btn
                    v-for="phone in doctor.phones"
                    :key="phone"
                    :href="`tel:${phone}`"
                    @click="logContact(doctor.name, 'Phone')"
                    variant="tonal"
                    color="success"
                    size="small"
                    rounded="lg"
                    class="me-2 mb-1"
                    :aria-label="`اتصال ${phone}`"
                  >
                    <v-icon start size="16">mdi-phone</v-icon>
                    {{ phone }}
                  </v-btn>
                  <v-btn
                    v-if="doctor.phones && doctor.phones.length > 0"
                    :href="`https://wa.me/${formatWhatsApp(doctor.phones[0])}`"
                    target="_blank"
                    @click="logContact(doctor.name, 'WhatsApp')"
                    variant="tonal"
                    color="green"
                    size="small"
                    rounded="lg"
                    class="mb-1"
                    :aria-label="`واتساب ${doctor.name}`"
                  >
                    <v-icon start size="16">mdi-whatsapp</v-icon>
                    واتساب
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Empty state -->
        <v-card v-if="displayedSpecialties.length === 0" class="text-center py-12" rounded="xl">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">
            {{ viewMode === 'favorites' ? 'mdi-heart-off-outline' : 'mdi-doctor' }}
          </v-icon>
          <p class="text-h6 text-grey">
            {{ viewMode === 'favorites' ? 'لا توجد أطباء في المفضلة' : 'لم يتم العثور على أطباء' }}
          </p>
          <p class="text-body-2 text-grey-lighten-1 mb-4">
            {{ viewMode === 'favorites' ? 'اضغط على ❤️ لإضافة أطباء للمفضلة' : 'جرب تعديل البحث أو الفلاتر' }}
          </p>
          <v-btn v-if="viewMode === 'favorites'" variant="tonal" color="primary" @click="viewMode = 'all'">
            عرض جميع الأطباء
          </v-btn>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import doctorsData from '@/data/doctors.json'
import { logAudit } from '@/utils/auth'

export default {
  name: 'DoctorsPage',
  data() {
    return {
      searchQuery: '',
      filterSpecialty: null,
      filterLocation: null,
      viewMode: 'all',
      specialties: doctorsData,
      favorites: []
    }
  },
  computed: {
    specialtyOptions() {
      return this.specialties.map(s => ({ title: s.name, value: s.name }))
    },
    locationOptions() {
      const locations = new Set()
      this.specialties.forEach(s => {
        s.doctors.forEach(d => {
          if (d.location) locations.add(d.location)
        })
      })
      return [...locations].sort().map(l => ({ title: l, value: l }))
    },
    filteredSpecialties() {
      let result = this.specialties

      if (this.filterSpecialty) {
        result = result.filter(s => s.name === this.filterSpecialty)
      }

      if (this.filterLocation) {
        result = result
          .map(s => ({
            ...s,
            doctors: s.doctors.filter(d => d.location === this.filterLocation)
          }))
          .filter(s => s.doctors.length > 0)
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result
          .map(s => ({
            ...s,
            doctors: s.doctors.filter(d =>
              d.name.toLowerCase().includes(query) ||
              (d.address && d.address.toLowerCase().includes(query))
            )
          }))
          .filter(s => s.doctors.length > 0)
      }

      return result
    },
    favoritesSpecialties() {
      if (this.favorites.length === 0) return []
      return this.filteredSpecialties
        .map(s => ({
          ...s,
          doctors: s.doctors.filter(d => this.favorites.includes(d.name))
        }))
        .filter(s => s.doctors.length > 0)
    },
    displayedSpecialties() {
      return this.viewMode === 'favorites' ? this.favoritesSpecialties : this.filteredSpecialties
    },
    totalDoctors() {
      return this.specialties.reduce((sum, s) => sum + s.doctors.length, 0)
    },
    favoriteCount() {
      return this.favorites.length
    }
  },
  mounted() {
    this.loadFavorites()
  },
  methods: {
    logContact(doctorName, method) {
      logAudit('CONTACT_DOCTOR', `قام بمحاولة التواصل مع الطبيب ${doctorName} عبر ${method}`)
    },
    resetFilters() {
      this.searchQuery = ''
      this.filterSpecialty = null
      this.filterLocation = null
    },
    toggleFavorite(name) {
      const index = this.favorites.indexOf(name)
      if (index >= 0) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(name)
      }
      this.saveFavorites()
    },
    isFavorite(name) {
      return this.favorites.includes(name)
    },
    loadFavorites() {
      try {
        const saved = localStorage.getItem('blood-favorite-doctors')
        if (saved) this.favorites = JSON.parse(saved)
      } catch {
        this.favorites = []
      }
    },
    saveFavorites() {
      localStorage.setItem('blood-favorite-doctors', JSON.stringify(this.favorites))
    },
    formatWhatsApp(phone) {
      if (!phone) return ''
      let cleaned = phone.replace(/\D/g, '')
      if (cleaned.startsWith('0')) cleaned = '2' + cleaned
      if (!cleaned.startsWith('20')) cleaned = '20' + cleaned
      return cleaned
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

.doctor-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.doctor-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12) !important;
}
</style>
