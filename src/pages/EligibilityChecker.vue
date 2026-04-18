<template>
  <v-container class="py-6 py-md-10" dir="rtl">
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">

        <!-- Hero header -->
        <div class="text-center mb-8">
          <v-avatar size="72" color="primary" class="mb-4 hero-icon">
            <v-icon size="36" color="white">mdi-clipboard-check</v-icon>
          </v-avatar>
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">اختبار أهلية التبرع</h1>
          <p class="text-body-1 text-grey mt-2">أجب على الأسئلة لمعرفة هل يمكنك التبرع بالدم</p>
        </div>

        <!-- Result Card -->
        <v-card v-if="showResult" class="mb-8 pa-8 text-center result-card" rounded="xl" :color="isEligible ? 'success' : 'error'" variant="tonal">
          <v-icon size="80" :color="isEligible ? 'success' : 'error'" class="mb-4">
            {{ isEligible ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
          <h2 class="text-h5 font-weight-bold mb-2">
            {{ isEligible ? '🎉 يمكنك التبرع بالدم!' : '⚠️ لا يمكنك التبرع حالياً' }}
          </h2>
          <p class="text-body-1 mb-4">{{ resultMessage }}</p>
          
          <div v-if="!isEligible && failReasons.length > 0" class="text-start mb-6">
            <p class="text-subtitle-2 font-weight-bold mb-2">الأسباب:</p>
            <v-chip v-for="reason in failReasons" :key="reason" color="error" variant="tonal" class="me-2 mb-2" size="small">
              <v-icon start size="16">mdi-information</v-icon>
              {{ reason }}
            </v-chip>
          </div>

          <div class="d-flex ga-3 justify-center flex-wrap">
            <v-btn v-if="isEligible" to="/add" color="primary" size="large" prepend-icon="mdi-plus-circle" rounded="lg">
              سجل كمتبرع الآن
            </v-btn>
            <v-btn @click="resetQuiz" variant="tonal" size="large" prepend-icon="mdi-refresh" rounded="lg">
              إعادة الاختبار
            </v-btn>
          </div>
        </v-card>

        <!-- Questions Stepper -->
        <v-card v-if="!showResult" class="pa-6 pa-md-8" rounded="xl">
          <!-- Progress -->
          <div class="mb-6">
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 font-weight-bold">السؤال {{ currentStep + 1 }} من {{ questions.length }}</span>
              <span class="text-body-2 text-grey">{{ progressPercent }}%</span>
            </div>
            <v-progress-linear :model-value="progressPercent" color="primary" rounded height="8"></v-progress-linear>
          </div>

          <!-- Question -->
          <transition name="slide-fade" mode="out-in">
            <div :key="currentStep">
              <div class="d-flex align-center mb-6">
                <v-avatar size="44" color="primary" variant="tonal" class="me-3">
                  <v-icon color="primary">{{ questions[currentStep].icon }}</v-icon>
                </v-avatar>
                <h3 class="text-h6 font-weight-bold">{{ questions[currentStep].question }}</h3>
              </div>

              <!-- Age input -->
              <template v-if="questions[currentStep].type === 'number'">
                <v-text-field
                  v-model.number="answers[currentStep]"
                  :label="questions[currentStep].label"
                  type="number"
                  :min="questions[currentStep].min"
                  :max="questions[currentStep].max"
                  prepend-inner-icon="mdi-calendar"
                  class="mb-4"
                ></v-text-field>
              </template>

              <!-- Weight input -->
              <template v-else-if="questions[currentStep].type === 'weight'">
                <v-text-field
                  v-model.number="answers[currentStep]"
                  label="الوزن بالكيلوجرام"
                  type="number"
                  min="30"
                  max="200"
                  prepend-inner-icon="mdi-weight-kilogram"
                  class="mb-4"
                ></v-text-field>
              </template>

              <!-- Yes/No -->
              <template v-else>
                <div class="d-flex ga-4 mb-4">
                  <v-btn 
                    size="x-large" 
                    :variant="answers[currentStep] === true ? 'flat' : 'outlined'"
                    :color="answers[currentStep] === true ? 'primary' : 'grey'"
                    rounded="lg"
                    class="flex-grow-1"
                    @click="answers[currentStep] = true"
                  >
                    <v-icon start>mdi-check</v-icon>
                    نعم
                  </v-btn>
                  <v-btn 
                    size="x-large" 
                    :variant="answers[currentStep] === false ? 'flat' : 'outlined'"
                    :color="answers[currentStep] === false ? 'primary' : 'grey'"
                    rounded="lg"
                    class="flex-grow-1"
                    @click="answers[currentStep] = false"
                  >
                    <v-icon start>mdi-close</v-icon>
                    لا
                  </v-btn>
                </div>
              </template>

              <p v-if="questions[currentStep].hint" class="text-body-2 text-grey mb-4">
                <v-icon size="16" class="me-1">mdi-information-outline</v-icon>
                {{ questions[currentStep].hint }}
              </p>
            </div>
          </transition>

          <!-- Navigation -->
          <div class="d-flex justify-space-between mt-6">
            <v-btn 
              :disabled="currentStep === 0" 
              @click="currentStep--" 
              variant="tonal" 
              color="grey"
              prepend-icon="mdi-arrow-right"
              rounded="lg"
            >
              السابق
            </v-btn>
            <v-btn 
              v-if="currentStep < questions.length - 1"
              @click="nextStep" 
              color="primary"
              :disabled="answers[currentStep] === null || answers[currentStep] === undefined"
              append-icon="mdi-arrow-left"
              rounded="lg"
            >
              التالي
            </v-btn>
            <v-btn 
              v-else
              @click="submitQuiz" 
              color="success"
              :disabled="answers[currentStep] === null || answers[currentStep] === undefined"
              prepend-icon="mdi-check-circle"
              rounded="lg"
              size="large"
            >
              عرض النتيجة
            </v-btn>
          </div>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'EligibilityChecker',
  data() {
    return {
      currentStep: 0,
      showResult: false,
      isEligible: false,
      resultMessage: '',
      failReasons: [],
      answers: [],
      questions: [
        {
          question: 'كم عمرك؟',
          icon: 'mdi-calendar-account',
          type: 'number',
          label: 'العمر بالسنوات',
          min: 10,
          max: 100,
          hint: 'يجب أن يكون العمر بين 18 و 65 سنة',
          check: (val) => val >= 18 && val <= 65,
          failMsg: 'العمر يجب أن يكون بين 18 و 65 سنة'
        },
        {
          question: 'كم وزنك بالكيلوجرام؟',
          icon: 'mdi-weight-kilogram',
          type: 'weight',
          hint: 'يجب أن يكون الوزن 50 كجم على الأقل',
          check: (val) => val >= 50,
          failMsg: 'الوزن يجب أن يكون 50 كجم على الأقل'
        },
        {
          question: 'هل تعاني من أي مرض مزمن؟',
          icon: 'mdi-heart-pulse',
          type: 'yesno',
          hint: 'مثل: السكر، الضغط، أمراض القلب، الكبد',
          check: (val) => val === false,
          failMsg: 'وجود مرض مزمن قد يمنع التبرع'
        },
        {
          question: 'هل تتناول أي أدوية حالياً؟',
          icon: 'mdi-pill',
          type: 'yesno',
          hint: 'بعض الأدوية قد تمنع التبرع مؤقتاً',
          check: (val) => val === false,
          failMsg: 'تناول بعض الأدوية قد يمنع التبرع'
        },
        {
          question: 'هل أجريت عملية جراحية في آخر 6 أشهر؟',
          icon: 'mdi-hospital-box',
          type: 'yesno',
          hint: 'يجب الانتظار 6 أشهر بعد أي عملية جراحية',
          check: (val) => val === false,
          failMsg: 'يجب الانتظار 6 أشهر بعد العملية الجراحية'
        },
        {
          question: 'هل تبرعت بالدم في آخر 56 يوم (شهرين)؟',
          icon: 'mdi-water',
          type: 'yesno',
          hint: 'يجب الانتظار 56 يوم على الأقل بين كل تبرع',
          check: (val) => val === false,
          failMsg: 'يجب الانتظار 56 يوم بين كل تبرع'
        },
        {
          question: 'هل لديك أي عدوى أو حمى حالياً؟',
          icon: 'mdi-thermometer',
          type: 'yesno',
          hint: 'يجب أن تكون بصحة جيدة وقت التبرع',
          check: (val) => val === false,
          failMsg: 'يجب أن تكون خالياً من أي عدوى أو حمى'
        },
        {
          question: 'هل نسبة الهيموجلوبين لديك طبيعية؟',
          icon: 'mdi-blood-bag',
          type: 'yesno',
          hint: 'يجب أن تكون 12.5 جم/دل على الأقل للنساء و 13.0 للرجال',
          check: (val) => val === true,
          failMsg: 'نسبة الهيموجلوبين أقل من الحد المطلوب'
        }
      ]
    }
  },
  computed: {
    progressPercent() {
      return Math.round(((this.currentStep + 1) / this.questions.length) * 100)
    }
  },
  created() {
    this.answers = new Array(this.questions.length).fill(null)
  },
  methods: {
    nextStep() {
      if (this.answers[this.currentStep] !== null && this.answers[this.currentStep] !== undefined) {
        this.currentStep++
      }
    },
    submitQuiz() {
      this.failReasons = []
      
      this.questions.forEach((q, i) => {
        if (!q.check(this.answers[i])) {
          this.failReasons.push(q.failMsg)
        }
      })

      this.isEligible = this.failReasons.length === 0
      this.resultMessage = this.isEligible 
        ? 'بناءً على إجاباتك، أنت مؤهل للتبرع بالدم. شكراً لمساهمتك في إنقاذ الأرواح! ❤️'
        : 'بناءً على إجاباتك، لا يمكنك التبرع بالدم حالياً. يرجى استشارة طبيب للمزيد من المعلومات.'
      
      this.showResult = true
    },
    resetQuiz() {
      this.currentStep = 0
      this.showResult = false
      this.isEligible = false
      this.resultMessage = ''
      this.failReasons = []
      this.answers = new Array(this.questions.length).fill(null)
    }
  }
}
</script>

<style scoped>
.hero-icon {
  box-shadow: 0 8px 32px rgba(198, 40, 40, 0.3);
}

.result-card {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
