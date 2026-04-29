<template>
  <v-container class="py-6 py-md-10" dir="rtl" style="min-height: 80vh; display: flex; align-items: center;">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="5">
        
        <v-card class="pa-6" rounded="xl" elevation="4">
          <div class="text-center mb-6">
            <v-avatar size="64" color="primary" class="mb-3 hero-icon">
              <v-icon size="32" color="white">mdi-shield-account</v-icon>
            </v-avatar>
            <h1 class="text-h5 font-weight-bold">{{ isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد' }}</h1>
            <p class="text-body-2 text-grey mt-1">
              {{ isLogin ? 'أدخل بياناتك للوصول إلى حسابك' : 'انضم إلينا لتتمكن من إضافة متبرعين' }}
            </p>
          </div>

          <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4" closable @click:close="errorMsg = ''">
            {{ errorMsg }}
          </v-alert>

          <v-form ref="form" @submit.prevent="handleSubmit">
            <!-- Name (Only for Register) -->
            <v-expand-transition>
              <div v-show="!isLogin">
                <v-text-field
                  v-model="form.name"
                  label="الاسم الكامل"
                  prepend-inner-icon="mdi-account"
                  :rules="!isLogin ? [v => !!v || 'الاسم مطلوب'] : []"
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model="form.phone"
                  label="رقم الهاتف (لربط تبرعاتك)"
                  prepend-inner-icon="mdi-phone"
                  class="mb-2"
                ></v-text-field>
              </div>
            </v-expand-transition>

            <v-text-field
              v-model="form.email"
              label="البريد الإلكتروني"
              type="email"
              prepend-inner-icon="mdi-email"
              :rules="[v => !!v || 'البريد الإلكتروني مطلوب', v => /.+@.+\..+/.test(v) || 'بريد إلكتروني غير صالح']"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              :label="isLogin ? 'كلمة المرور' : 'كلمة المرور (6 أحرف على الأقل)'"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[v => !!v || 'كلمة المرور مطلوبة', v => v.length >= 6 || '6 أحرف على الأقل']"
              class="mb-4"
            ></v-text-field>

            <v-btn
              type="submit"
              block
              color="primary"
              size="x-large"
              rounded="lg"
              :loading="loading"
            >
              {{ isLogin ? 'دخول' : 'تسجيل حساب' }}
            </v-btn>
          </v-form>

          <v-divider class="my-6"></v-divider>

          <div class="text-center">
            <span class="text-body-2 text-grey">
              {{ isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟' }}
            </span>
            <v-btn variant="text" color="primary" @click="toggleMode" class="font-weight-bold ms-1">
              {{ isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول' }}
            </v-btn>
          </div>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { login, register, logAudit } from '@/utils/auth'

export default {
  name: 'AuthPage',
  data() {
    return {
      isLogin: true,
      loading: false,
      showPassword: false,
      errorMsg: '',
      form: {
        name: '',
        email: '',
        password: '',
        phone: ''
      }
    }
  },
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin
      this.errorMsg = ''
      this.form.password = ''
    },
    async handleSubmit() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.loading = true
      this.errorMsg = ''

      try {
        let response
        if (this.isLogin) {
          response = await login(this.form.email, this.form.password)
        } else {
          response = await register(this.form.email, this.form.password, this.form.name, this.form.phone)
        }

        // Handle Supabase fake success when email already exists (identities array is empty)
        if (!this.isLogin && !response.error && response.data?.user && response.data.user.identities && response.data.user.identities.length === 0) {
          this.errorMsg = 'هذا البريد الإلكتروني مسجل بالفعل.';
          this.loading = false;
          return;
        }

        if (response.error) {
          // Translate common Supabase auth errors to Arabic
          const msg = response.error.message || '';
          const lowerMsg = msg.toLowerCase();
          
          if (lowerMsg.includes('invalid login credentials')) {
            this.errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
          } else if (lowerMsg.includes('already registered')) {
            this.errorMsg = 'هذا البريد الإلكتروني مسجل بالفعل.';
          } else if (lowerMsg.includes('password should be at least 6 characters') || lowerMsg.includes('password must be at least')) {
            this.errorMsg = 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.';
          } else if (lowerMsg.includes('password should contain') || lowerMsg.includes('weak password')) {
            this.errorMsg = 'كلمة المرور ضعيفة جداً. يرجى اختيار كلمة مرور أقوى.';
          } else if (lowerMsg.includes('email not confirmed')) {
            this.errorMsg = 'يرجى تأكيد بريدك الإلكتروني أولاً.';
          } else if (lowerMsg.includes('rate limit') || lowerMsg.includes('too many requests')) {
            this.errorMsg = 'محاولات كثيرة جداً. يرجى المحاولة لاحقاً.';
          } else if (lowerMsg.includes('email not found')) {
            this.errorMsg = 'البريد الإلكتروني غير موجود.';
          } else if (lowerMsg.includes('unable to validate email') || lowerMsg.includes('invalid email')) {
            this.errorMsg = 'صيغة البريد الإلكتروني غير صالحة.';
          } else if (lowerMsg.includes('signups not allowed') || lowerMsg.includes('signups are disabled')) {
            this.errorMsg = 'عذراً، تسجيل الحسابات الجديدة غير متاح في الوقت الحالي.';
          } else if (lowerMsg.includes('failed to fetch') || lowerMsg.includes('network error')) {
            this.errorMsg = 'لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مجدداً.';
          } else if (lowerMsg.includes('database error')) {
            this.errorMsg = 'حدث خطأ في قاعدة البيانات. يرجى المحاولة لاحقاً.';
          } else {
            this.errorMsg = msg; // Fallback to original if we don't have a translation
          }
        } else {
          if (!this.isLogin) {
            await logAudit('REGISTER', 'تم إنشاء حساب جديد')
          }
          // Success! Redirect to home or wherever they came from
          this.$emit('show-toast', { 
            message: this.isLogin ? 'تم تسجيل الدخول بنجاح!' : 'تم إنشاء الحساب بنجاح! الرجاء التحقق من بريدك الإلكتروني إذا تطلب الأمر.', 
            color: 'success' 
          })
          
          // Wait a moment before redirecting
          setTimeout(() => {
            const redirectPath = this.$route.query.redirect || '/'
            this.$router.push(redirectPath)
          }, 1000)
        }
      } catch (err) {
        const errMsg = err?.message?.toLowerCase() || '';
        if (errMsg.includes('failed to fetch') || errMsg.includes('network error')) {
          this.errorMsg = 'لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مجدداً.';
        } else {
          this.errorMsg = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.hero-icon {
  box-shadow: 0 4px 20px rgba(198, 40, 40, 0.3);
}
</style>
