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
        
        <v-alert v-if="error" type="error" variant="tonal" border="start" class="mb-5" rounded="lg">
          {{ error }}
        </v-alert>
        
        <v-alert v-if="success" type="success" variant="tonal" border="start" class="mb-5" rounded="lg">
          <div class="d-flex align-center">
            <v-icon class="me-2">mdi-check-circle</v-icon>
            تم تسجيل المتبرع بنجاح! جاري التحويل...
          </div>
        </v-alert>
        
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
                        <v-chip size="small" :color="getBloodColor(item.raw)" variant="flat" class="me-2 font-weight-bold">
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
import axios from 'axios'

const API_URL = 'https://blooddonation-api-983366835228.europe-west9.run.app'

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
      bloodTypes: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
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
          v => !!v || 'النوع مطلوب',
          v => (v && v.length >= 3) || 'النوع يجب أن يكون 3 أحرف على الأقل',
          v => (v && v.length <= 10) || 'النوع يجب أن لا يتجاوز 10 أحرف'
        ],
        bloodType: [
          v => !!v || 'فصيلة الدم مطلوبة',
          v => (v && v.length >= 1) || 'فصيلة الدم يجب أن تكون 1 حرف على الأقل',
          v => (v && v.length <= 10) || 'فصيلة الدم يجب أن لا تتجاوز 10 أحرف'
        ],
        tel: [
          v => !!v || 'رقم الموبايل مطلوب',
          v => (v && v.length >= 8) || 'رقم الموبايل يجب أن يكون 8 أرقام على الأقل',
          v => (v && v.length <= 11) || 'رقم الموبايل يجب أن لا يتجاوز 11 رقم'
        ],
        mail: [
          v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'صيغة البريد الإلكتروني غير صحيحة'
        ],
        birthDate: [
          v => !!v || 'تاريخ الميلاد مطلوب',
          v => (v && v.length >= 8) || 'تاريخ الميلاد يجب أن يكون 8 أحرف على الأقل',
          v => (v && v.length <= 10) || 'تاريخ الميلاد يجب أن لا يتجاوز 10 أحرف'
        ]
      },
      error: null,
      success: false,
      submitting: false
    }
  },
  methods: {
    async submitForm() {
      try {
        // Validate form before submission
        const isValid = await this.$refs.form.validate()
        if (!isValid) {
          this.error = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح'
          return
        }

        this.error = null
        this.success = false
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

        const response = await axios.post(`${API_URL}/donor`, payload)
        
        this.success = true
        this.resetForm()
        
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      } catch (err) {
        this.error = `فشل تسجيل المتبرع: ${err.response?.data?.message || err.message}`
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
    getBloodColor(type) {
      const colors = {
        'O+': '#FF6B6B', 'O-': '#FFA07A',
        'A+': '#4ECDC4', 'A-': '#45B7D1',
        'B+': '#F7DC6F', 'B-': '#F39C12',
        'AB+': '#BB8FCE', 'AB-': '#9B59B6'
      }
      return colors[type] || '#95A5A6'
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