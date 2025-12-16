<template>
  <v-container class="py-4 py-md-8" dir="rtl">
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">
        <h1 class="mb-6">تسجيل متبرع جديد</h1>
        
        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>
        
        <v-alert v-if="success" type="success" class="mb-4">
          تم تسجيل المتبرع بنجاح!
        </v-alert>
        
        <v-form ref="form" @submit.prevent="submitForm">
          <v-card class="pa-4 pa-md-6">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="الاسم *"
                  variant="outlined"
                  :rules="rules.name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.mail"
                  label="البريد الإلكتروني :"
                  type="email"
                  variant="outlined"
                  :rules="rules.mail"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.birthDate"
                  label="تاريخ الميلاد : *"
                  type="date"
                  variant="outlined"
                  :rules="rules.birthDate"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.tel"
                  label="رقم الموبايل : *"
                  variant="outlined"
                  :rules="rules.tel"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="form.gender"
                  label="النوع : *"
                  :items="genderOptions"
                  variant="outlined"
                  :rules="rules.gender"
                  required
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="form.bloodType"
                  label="فصيلة الدم : *"
                  :items="bloodTypes"
                  variant="outlined"
                  :rules="rules.bloodType"
                  required
                ></v-select>
              </v-col>
            </v-row>
            
            <!-- Actions -->
            <v-row class="mt-6">
              <v-col cols="12">
                <v-btn
                  type="submit"
                  block
                  color="primary"
                  size="large"
                  :loading="submitting"
                >
                  إرسال
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  variant="outlined"
                  color="error"
                  size="large"
                  @click="resetForm"
                >
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
    }
  }
}
</script>