<template>
  <v-container class="py-6 py-md-10" dir="rtl">
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">
        
        <!-- Hero header -->
        <div class="text-center mb-8">
          <v-avatar size="72" color="primary" class="mb-4 hero-icon">
            <v-icon size="36" color="white">mdi-account-plus</v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">تسجيل متبرع جديد</h1>
          <p class="text-body-1 text-grey mt-2">أضف بيانات المتبرع للانضمام إلى قاعدة البيانات</p>
        </div>
        
        <v-form ref="form" @submit.prevent="submitForm">
          <v-card class="pa-5 pa-md-8 form-card">
            
            <!-- Personal Info Section -->
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="me-2">mdi-account</v-icon>
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-2">المعلومات الشخصية</span>
            </div>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="الاسم *"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="rules.name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.birthDate"
                  label="تاريخ الميلاد *"
                  type="date"
                  prepend-inner-icon="mdi-calendar"
                  :rules="rules.birthDate"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="form.gender"
                  label="النوع *"
                  :items="genderOptions"
                  prepend-inner-icon="mdi-gender-male-female"
                  :rules="rules.gender"
                  required
                ></v-select>
              </v-col>
            </v-row>

            <v-divider class="my-5"></v-divider>

            <!-- Medical Info Section -->
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="me-2">mdi-water</v-icon>
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-2">معلومات التبرع</span>
            </div>

            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="form.bloodType"
                  label="فصيلة الدم *"
                  :items="bloodTypes"
                  prepend-inner-icon="mdi-water-outline"
                  :rules="rules.bloodType"
                  required
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-chip size="small" :color="getColor(item.raw)" variant="flat" class="me-2 font-weight-bold">
                          {{ item.raw }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-divider class="my-5"></v-divider>

            <!-- Contact Info Section -->
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="me-2">mdi-phone</v-icon>
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-2">معلومات الاتصال</span>
            </div>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.tel"
                  label="رقم الموبايل *"
                  prepend-inner-icon="mdi-cellphone"
                  :rules="rules.tel"
                  required
                  placeholder="01XXXXXXXXX"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.mail"
                  label="البريد الإلكتروني"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="rules.mail"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <!-- Actions -->
            <v-row class="mt-8">
              <v-col cols="12" sm="6">
                <v-btn
                  type="submit"
                  block
                  color="primary"
                  size="x-large"
                  :loading="submitting"
                  rounded="lg"
                  elevation="2"
                >
                  <v-icon start>mdi-check-circle</v-icon>
                  تسجيل المتبرع
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  variant="tonal"
                  color="grey"
                  size="x-large"
                  @click="resetForm"
                  rounded="lg"
                >
                  <v-icon start>mdi-refresh</v-icon>
                  إعادة ملء
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/utils/api'
import { logAudit } from '@/utils/auth'
import { BLOOD_TYPES, getBloodTypeColor, EGYPTIAN_PHONE_REGEX, calculateAge } from '@/utils/bloodTypes'

export default {
  name: 'AddDonor',
  data() {
    return {
      form: {
        name: '',
        bloodType: '',
        gender: '',
        birthDate: '',
        tel: '',
        mail: ''
      },
      bloodTypes: BLOOD_TYPES,
      genderOptions: [
        { title: 'ذكر', value: 'male' },
        { title: 'أنثى', value: 'female' }
      ],
      rules: {
        name: [
          v => !!v || 'الاسم مطلوب',
          v => (v && v.length >= 8) || 'الاسم يجب أن يكون 8 أحرف على الأقل',
          v => (v && v.length <= 32) || 'الاسم يجب أن لا يتجاوز 32 حرف'
        ],
        gender: [
          v => !!v || 'النوع مطلوب'
        ],
        bloodType: [
          v => !!v || 'فصيلة الدم مطلوبة'
        ],
        tel: [
          v => !!v || 'رقم الموبايل مطلوب',
          v => EGYPTIAN_PHONE_REGEX.test(v) || 'رقم الموبايل يجب أن يكون 01 ثم 9 أرقام'
        ],
        mail: [
          v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'صيغة البريد الإلكتروني غير صحيحة'
        ],
        birthDate: [
          v => !!v || 'تاريخ الميلاد مطلوب',
          v => {
            if (!v) return true
            const age = calculateAge(v)
            if (age < 18) return 'يجب أن يكون العمر 18 سنة على الأقل'
            if (age > 65) return 'يجب أن يكون العمر 65 سنة أو أقل'
            return true
          }
        ]
      },
      error: null,
      submitting: false
    }
  },
  methods: {
    async submitForm() {
      try {
        const { valid } = await this.$refs.form.validate()
        if (!valid) {
          this.$emit('show-toast', { 
            message: 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 
            color: 'error', 
            icon: 'mdi-alert-circle' 
          })
          return
        }

        this.error = null
        this.submitting = true

        const payload = {
          name: this.form.name,
          bloodType: this.form.bloodType,
          basicInfo: {
            gender: this.form.gender,
            birthDate: new Date(this.form.birthDate).toISOString()
          },
          contactInfo: {
            tel: this.form.tel,
            mail: this.form.mail
          }
        }

        await api.post('/donor', payload)
        await logAudit('DONOR_ADDED', `تم إضافة متبرع جديد: ${this.form.name} (${this.form.bloodType})`)
        
        this.$emit('show-toast', { 
          message: 'تم تسجيل المتبرع بنجاح! 🎉', 
          color: 'success', 
          icon: 'mdi-check-circle' 
        })
        this.resetForm()
        
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      } catch (err) {
        this.$emit('show-toast', { 
          message: `فشل تسجيل المتبرع: ${err.response?.data?.message || err.message}`, 
          color: 'error', 
          icon: 'mdi-alert-circle',
          timeout: 5000
        })
        console.error(err)
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      this.form = {
        name: '',
        bloodType: '',
        gender: '',
        birthDate: '',
        tel: '',
        mail: ''
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

.form-card {
  border-top: 4px solid #C62828;
}
</style>