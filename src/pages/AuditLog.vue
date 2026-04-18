<template>
  <v-container class="py-6 py-md-10" dir="rtl">
    <div class="d-flex align-center justify-space-between mb-8 flex-wrap ga-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">سجل النشاطات</h1>
        <p class="text-body-1 text-grey">مراقبة جميع الإجراءات التي تمت على النظام</p>
      </div>
      <div>
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="fetchLogs"
          :loading="loading"
          rounded="pill"
        >
          تحديث السجل
        </v-btn>
      </div>
    </div>

    <v-card rounded="xl" elevation="2">
      <v-table hover class="bg-surface">
        <thead>
          <tr>
            <th class="text-right font-weight-bold text-subtitle-1">الوقت والتاريخ</th>
            <th class="text-right font-weight-bold text-subtitle-1">المستخدم</th>
            <th class="text-right font-weight-bold text-subtitle-1">الإجراء</th>
            <th class="text-right font-weight-bold text-subtitle-1">التفاصيل</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="4" class="text-center pa-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div class="mt-2 text-grey">جاري تحميل السجل...</div>
            </td>
          </tr>
          <tr v-else-if="logs.length === 0">
            <td colspan="4" class="text-center pa-8 text-grey">
              <v-icon size="48" class="mb-2">mdi-history</v-icon>
              <div>السجل فارغ حالياً</div>
            </td>
          </tr>
          <tr v-for="log in logs" :key="log.id">
            <td class="text-body-2" style="white-space: nowrap;">
              {{ formatDate(log.created_at) }}
            </td>
            <td class="text-body-2 font-weight-bold text-primary">
              {{ log.user_email }}
            </td>
            <td>
              <v-chip :color="getActionColor(log.action)" size="small" variant="flat" class="font-weight-bold">
                {{ translateAction(log.action) }}
              </v-chip>
            </td>
            <td class="text-body-2 text-grey-darken-1">
              {{ log.description }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script>
import { supabase } from '@/utils/auth'

export default {
  name: 'AuditLog',
  data() {
    return {
      logs: [],
      loading: true
    }
  },
  mounted() {
    this.fetchLogs()
  },
  methods: {
    async fetchLogs() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)

        if (error) throw error
        this.logs = data
      } catch (err) {
        console.error('Error fetching logs:', err)
        this.$emit('show-toast', { message: 'فشل في تحميل سجل النشاطات', color: 'error' })
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    translateAction(action) {
      const map = {
        'LOGIN': 'تسجيل دخول',
        'REGISTER': 'حساب جديد',
        'LOGOUT': 'تسجيل خروج',
        'DONOR_ADDED': 'إضافة متبرع',
        'EMERGENCY_REQUEST': 'طلب طوارئ'
      }
      return map[action] || action
    },
    getActionColor(action) {
      const map = {
        'LOGIN': 'success',
        'REGISTER': 'info',
        'LOGOUT': 'grey',
        'DONOR_ADDED': 'primary',
        'EMERGENCY_REQUEST': 'error'
      }
      return map[action] || 'grey'
    }
  }
}
</script>
