<template>
  <v-container class="py-6 py-md-10" dir="rtl" max-width="800">
    <div class="text-center mb-8">
      <v-avatar size="72" color="primary" class="mb-4 hero-icon">
        <v-icon size="36" color="white">mdi-account-cog</v-icon>
      </v-avatar>
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">إعدادات الحساب</h1>
      <p class="text-body-1 text-grey mt-2">قم بتحديث بياناتك الشخصية وكلمة المرور الخاصة بك</p>
    </div>

    <!-- Alert for feedback -->
    <v-alert
      v-if="alert.show"
      :type="alert.type"
      variant="tonal"
      class="mb-6"
      closable
      @click:close="alert.show = false"
    >
      {{ alert.message }}
    </v-alert>

    <v-row>
      <!-- Personal Information Card -->
      <v-col cols="12">
        <v-card class="pa-6 rounded-xl" elevation="2">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="me-3" size="28">mdi-account-box</v-icon>
            <h2 class="text-h5 font-weight-bold mb-0">المعلومات الشخصية</h2>
          </div>
          
          <v-form @submit.prevent="saveProfile" v-model="profileFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.name"
                  label="الاسم الكامل"
                  prepend-inner-icon="mdi-account"
                  :rules="[v => !!v || 'الاسم مطلوب']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile.email"
                  label="البريد الإلكتروني"
                  prepend-inner-icon="mdi-email"
                  disabled
                  hint="لا يمكن تغيير البريد الإلكتروني في الوقت الحالي"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="profile.phone"
                  label="رقم الهاتف"
                  prepend-inner-icon="mdi-phone"
                  hint="لربط تبرعاتك السابقة (يجب أن يبدأ بـ 01)"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" v-if="linkedDonorId">
                <v-text-field
                  v-model="profile.last_donated_at"
                  label="تاريخ آخر مرة تبرعت فيها بالدم"
                  prepend-inner-icon="mdi-calendar-heart"
                  type="date"
                  hint="أضف تاريخ آخر تبرع لك لتذكر متى يمكنك التبرع مرة أخرى"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-else-if="profile.phone">
                <v-alert type="warning" variant="tonal" class="mt-2 text-body-2">
                  لم يتم العثور على متبرع بهذا الرقم. الرجاء التأكد من الرقم أو إضافة متبرع جديد.
                </v-alert>
              </v-col>
            </v-row>
            <div class="d-flex justify-end mt-4">
              <v-btn
                type="submit"
                color="primary"
                :loading="profileLoading"
                :disabled="!profileFormValid"
                rounded="lg"
                class="px-6"
              >
                <v-icon start>mdi-content-save</v-icon>
                حفظ التغييرات
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <!-- Password Change Card -->
      <v-col cols="12">
        <v-card class="pa-6 rounded-xl" elevation="2">
          <div class="d-flex align-center mb-6">
            <v-icon color="error" class="me-3" size="28">mdi-lock-reset</v-icon>
            <h2 class="text-h5 font-weight-bold mb-0">تغيير كلمة المرور</h2>
          </div>
          
          <v-form @submit.prevent="changePassword" v-model="passwordFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="passwords.new"
                  label="كلمة المرور الجديدة"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="passwordRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="passwords.confirm"
                  label="تأكيد كلمة المرور"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[...passwordRules, passwordMatchRule]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="d-flex justify-end mt-4">
              <v-btn
                type="submit"
                color="error"
                variant="tonal"
                :loading="passwordLoading"
                :disabled="!passwordFormValid"
                rounded="lg"
                class="px-6"
              >
                <v-icon start>mdi-key-change</v-icon>
                تحديث كلمة المرور
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getSession, updateProfile, logAudit } from '@/utils/auth'
import api from '@/utils/api'

export default {
  name: 'Profile',
  data() {
    return {
      session: null,
      profileLoading: false,
      passwordLoading: false,
      profileFormValid: false,
      passwordFormValid: false,
      showPassword: false,
      profile: {
        name: '',
        email: '',
        phone: '',
        last_donated_at: ''
      },
      linkedDonorId: null,
      original_last_donated_at: '',
      passwords: {
        new: '',
        confirm: ''
      },
      alert: {
        show: false,
        message: '',
        type: 'success'
      },
      passwordRules: [
        v => !!v || 'كلمة المرور مطلوبة',
        v => (v && v.length >= 6) || 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      ]
    }
  },
  computed: {
    passwordMatchRule() {
      return this.passwords.new === this.passwords.confirm || 'كلمات المرور غير متطابقة'
    }
  },
  async mounted() {
    this.session = await getSession()
    if (this.session && this.session.user) {
      this.profile.email = this.session.user.email
      this.profile.name = this.session.user.user_metadata?.full_name || ''
      this.profile.phone = this.session.user.user_metadata?.phone || ''
      this.fetchDonorByPhone()
    }
  },
  watch: {
    'profile.phone'(newVal, oldVal) {
      if (newVal && newVal !== oldVal && newVal.length >= 10) {
        // debounce check
        clearTimeout(this.phoneCheckTimeout);
        this.phoneCheckTimeout = setTimeout(() => {
          this.fetchDonorByPhone()
        }, 500)
      } else if (!newVal) {
        this.linkedDonorId = null
      }
    }
  },
  methods: {
    async fetchDonorByPhone() {
      if (!this.profile.phone) return;
      try {
        const response = await api.get('/donor/' + this.profile.phone)
        const donor = response.data
        if (donor && donor._id) {
          this.linkedDonorId = donor._id
          if (donor.donationDates && donor.donationDates.length > 0) {
            const lastDate = donor.donationDates[donor.donationDates.length - 1].when
            const formattedDate = new Date(lastDate).toISOString().split('T')[0]
            this.profile.last_donated_at = formattedDate
            this.original_last_donated_at = formattedDate
          } else {
            this.profile.last_donated_at = ''
            this.original_last_donated_at = ''
          }
        } else {
          this.linkedDonorId = null
        }
      } catch (err) {
        console.log('Donor not found with phone:', this.profile.phone)
        this.linkedDonorId = null
      }
    },
    showAlert(message, type = 'success') {
      this.alert = { show: true, message, type }
      // Auto hide after 5 seconds
      setTimeout(() => {
        this.alert.show = false
      }, 5000)
    },
    async saveProfile() {
      if (!this.profileFormValid) return
      
      this.profileLoading = true
      try {
        const { error } = await updateProfile({
          data: { 
            full_name: this.profile.name,
            phone: this.profile.phone
          }
        })
        
        if (error) throw error

        if (this.linkedDonorId && this.profile.last_donated_at && this.profile.last_donated_at !== this.original_last_donated_at) {
          try {
            await api.put('/donor/' + this.linkedDonorId, {
              when: this.profile.last_donated_at
            })
            this.original_last_donated_at = this.profile.last_donated_at
          } catch (err) {
            console.error('Failed to save donation date to MongoDB', err)
            throw new Error('فشل في حفظ تاريخ التبرع في قاعدة البيانات')
          }
        }
        
        await logAudit('UPDATE_PROFILE', 'قام المستخدم بتحديث بياناته')
        this.showAlert('تم تحديث البيانات بنجاح!')
        
        this.$emit('show-toast', { message: 'تم تحديث الاسم بنجاح' })
        
        // Quick reload to update layout name globally if needed
        setTimeout(() => { window.location.reload() }, 1000)
      } catch (err) {
        this.showAlert(err.message || 'حدث خطأ أثناء تحديث البيانات', 'error')
      } finally {
        this.profileLoading = false
      }
    },
    async changePassword() {
      if (!this.passwordFormValid) return
      
      this.passwordLoading = true
      try {
        const { error } = await updateProfile({
          password: this.passwords.new
        })
        
        if (error) throw error
        
        await logAudit('UPDATE_PASSWORD', 'قام المستخدم بتغيير كلمة المرور')
        this.showAlert('تم تحديث كلمة المرور بنجاح! احتفظ بها في مكان آمن.')
        this.passwords.new = ''
        this.passwords.confirm = ''
        
        this.$emit('show-toast', { message: 'تم تغيير كلمة المرور بنجاح' })
      } catch (err) {
        this.showAlert(err.message || 'حدث خطأ أثناء تغيير كلمة المرور', 'error')
      } finally {
        this.passwordLoading = false
      }
    }
  }
}
</script>

<style scoped>
.hero-icon {
  box-shadow: 0 8px 32px rgba(198, 40, 40, 0.3);
}
</style>
