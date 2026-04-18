<template>
  <v-container class="py-6 py-md-10" dir="rtl">
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">

        <!-- Hero header -->
        <div class="text-center mb-8">
          <v-avatar size="72" color="error" class="mb-4 hero-icon-emergency">
            <v-icon size="36" color="white">mdi-alert-circle</v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">طلب دم عاجل</h1>
          <p class="text-body-1 text-grey mt-2">أنشئ طلب تبرع طارئ وشاركه على واتساب</p>
        </div>

        <!-- Generated Card Preview -->
        <v-card v-if="showPreview" class="mb-6 preview-card" rounded="xl" elevation="3">
          <div class="emergency-header pa-6 text-center text-white">
            <v-icon size="48" color="white" class="mb-2">mdi-water</v-icon>
            <h2 class="text-h5 font-weight-bold">🚨 طلب تبرع بالدم عاجل 🚨</h2>
          </div>
          <v-card-text class="pa-6">
            <v-row no-gutters class="mb-4">
              <v-col cols="6">
                <div class="text-caption text-grey font-weight-bold">اسم المريض</div>
                <div class="text-body-1 font-weight-bold">{{ form.patientName }}</div>
              </v-col>
              <v-col cols="6">
                <div class="text-caption text-grey font-weight-bold">فصيلة الدم المطلوبة</div>
                <v-chip :color="getColor(form.bloodType)" variant="flat" class="font-weight-bold mt-1">
                  {{ form.bloodType }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-4">
              <v-col cols="6">
                <div class="text-caption text-grey font-weight-bold">عدد الأكياس</div>
                <div class="text-body-1 font-weight-bold">{{ form.units }} كيس</div>
              </v-col>
              <v-col cols="6">
                <div class="text-caption text-grey font-weight-bold">المستشفى</div>
                <div class="text-body-1 font-weight-bold">{{ form.hospital }}</div>
              </v-col>
            </v-row>
            <div class="mb-4">
              <div class="text-caption text-grey font-weight-bold">رقم التواصل</div>
              <div class="text-body-1 font-weight-bold">{{ form.contactPhone }}</div>
            </div>
            <div v-if="form.notes">
              <div class="text-caption text-grey font-weight-bold">ملاحظات</div>
              <div class="text-body-2">{{ form.notes }}</div>
            </div>
          </v-card-text>
          
          <v-divider></v-divider>
          
          <v-card-actions class="pa-4 flex-wrap ga-2">
            <v-btn
              :href="whatsappShareUrl"
              target="_blank"
              color="green"
              variant="flat"
              prepend-icon="mdi-whatsapp"
              rounded="lg"
              class="flex-grow-1"
            >
              مشاركة عبر واتساب
            </v-btn>
            <v-btn
              @click="copyToClipboard"
              color="info"
              variant="tonal"
              prepend-icon="mdi-content-copy"
              rounded="lg"
              class="flex-grow-1"
            >
              نسخ النص
            </v-btn>
            <v-btn
              @click="showPreview = false"
              variant="tonal"
              color="grey"
              prepend-icon="mdi-pencil"
              rounded="lg"
              class="flex-grow-1"
            >
              تعديل
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Matching Donors -->
        <v-card v-if="showPreview && matchingDonors.length > 0" class="mb-6 pa-6" rounded="xl">
          <div class="d-flex align-center mb-4">
            <v-icon color="success" class="me-2">mdi-account-check</v-icon>
            <span class="text-subtitle-1 font-weight-bold">متبرعون متاحون بفصيلة {{ form.bloodType }}</span>
            <v-chip class="ms-2" size="small" color="success" variant="tonal">{{ matchingDonors.length }}</v-chip>
          </div>
          <v-list>
            <v-list-item v-for="donor in matchingDonors" :key="donor._id" rounded="lg" class="mb-1">
              <template v-slot:prepend>
                <v-avatar size="36" color="primary" variant="tonal">
                  <v-icon size="18">mdi-account</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">{{ donor.name }}</v-list-item-title>
              <template v-slot:append>
                <div class="d-flex ga-1">
                  <v-btn 
                    :href="`tel:01012490898`" 
                    @click="logContact('Emergency Hub', 'Phone')"
                    icon="mdi-phone" 
                    variant="tonal" 
                    color="success" 
                    size="x-small"
                    :aria-label="`اتصال`"
                  ></v-btn>
                  <v-btn 
                    :href="`https://wa.me/${formatWhatsApp('01012490898')}`"
                    target="_blank"
                    @click="logContact('Emergency Hub', 'WhatsApp')"
                    icon="mdi-whatsapp" 
                    variant="tonal" 
                    color="green" 
                    size="x-small"
                    :aria-label="`واتساب ${donor.name}`"
                  ></v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Form -->
        <v-form v-if="!showPreview" ref="form" @submit.prevent="generateRequest">
          <v-card class="pa-6 pa-md-8 form-card" rounded="xl">
            
            <div class="d-flex align-center mb-6">
              <v-icon color="error" class="me-2">mdi-hospital-box</v-icon>
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-2">بيانات الطلب</span>
            </div>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.patientName"
                  label="اسم المريض *"
                  prepend-inner-icon="mdi-account"
                  :rules="[v => !!v || 'مطلوب']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="form.bloodType"
                  :items="bloodTypes"
                  label="فصيلة الدم المطلوبة *"
                  prepend-inner-icon="mdi-water"
                  :rules="[v => !!v || 'مطلوب']"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="form.units"
                  label="عدد الأكياس *"
                  type="number"
                  min="1"
                  max="10"
                  prepend-inner-icon="mdi-blood-bag"
                  :rules="[v => !!v || 'مطلوب', v => v > 0 || 'عدد غير صحيح']"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.hospital"
                  label="المستشفى / المكان *"
                  prepend-inner-icon="mdi-hospital-building"
                  :rules="[v => !!v || 'مطلوب']"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.contactPhone"
                  label="رقم التواصل *"
                  prepend-inner-icon="mdi-phone"
                  :rules="[v => !!v || 'مطلوب']"
                  placeholder="01XXXXXXXXX"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.notes"
                  label="ملاحظات إضافية"
                  prepend-inner-icon="mdi-note-text"
                  rows="2"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              block
              color="error"
              size="x-large"
              rounded="lg"
              :loading="loadingDonors"
              class="mt-4"
            >
              <v-icon start>mdi-send</v-icon>
              إنشاء الطلب
            </v-btn>
          </v-card>
        </v-form>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/utils/api'
import { logAudit } from '@/utils/auth'
import { BLOOD_TYPES, getBloodTypeColor } from '@/utils/bloodTypes'

export default {
  name: 'ShareRequest',
  data() {
    return {
      form: {
        patientName: '',
        bloodType: '',
        units: 1,
        hospital: '',
        contactPhone: '',
        notes: ''
      },
      bloodTypes: BLOOD_TYPES,
      showPreview: false,
      matchingDonors: [],
      loadingDonors: false
    }
  },
  computed: {
    shareMessage() {
      let msg = `🚨 *طلب تبرع بالدم عاجل* 🚨\n\n`
      msg += `👤 اسم المريض: *${this.form.patientName}*\n`
      msg += `🩸 فصيلة الدم: *${this.form.bloodType}*\n`
      msg += `📦 عدد الأكياس: *${this.form.units}*\n`
      msg += `🏥 المستشفى: *${this.form.hospital}*\n`
      msg += `📞 رقم التواصل: *${this.form.contactPhone}*\n`
      if (this.form.notes) {
        msg += `📝 ملاحظات: ${this.form.notes}\n`
      }
      msg += `\n❤️ تبرعك بالدم ينقذ حياة ❤️`
      return msg
    },
    whatsappShareUrl() {
      return `https://wa.me/201012490898?text=${encodeURIComponent(this.shareMessage)}`
    }
  },
  methods: {
    logContact(description, method) {
      logAudit('CONTACT_EMERGENCY', `تواصل طوارئ: ${description} عبر ${method}`)
    },
    async generateRequest() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.loadingDonors = true
      try {
        const response = await api.get('/donor')
        this.matchingDonors = response.data.filter(d => d.bloodType === this.form.bloodType)
      } catch {
        this.matchingDonors = []
      } finally {
        this.loadingDonors = false
      }

      this.showPreview = true
      await logAudit('EMERGENCY_REQUEST', `إنشاء طلب طوارئ لفصيلة ${this.form.bloodType} في ${this.form.hospital}`)
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.shareMessage.replace(/\*/g, ''))
        this.$emit('show-toast', { message: 'تم نسخ النص! 📋', color: 'success', icon: 'mdi-check-circle' })
      } catch {
        this.$emit('show-toast', { message: 'فشل في النسخ', color: 'error', icon: 'mdi-alert' })
      }
    },
    getColor(type) {
      return getBloodTypeColor(type)
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
.hero-icon-emergency {
  box-shadow: 0 8px 32px rgba(211, 47, 47, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(211, 47, 47, 0.4); }
  50% { box-shadow: 0 8px 48px rgba(211, 47, 47, 0.7); }
}

.emergency-header {
  background: linear-gradient(135deg, #C62828 0%, #8E0000 100%);
}

.form-card {
  border-top: 4px solid #D32F2F;
}

.preview-card {
  animation: scaleIn 0.4s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
