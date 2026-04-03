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
          <p class="text-body-1 text-grey mt-2">بيانات الأطباء الأكثر سؤالاً عنهم</p>
        </div>

        <!-- Search -->
        <v-card class="mb-6 pa-5 filter-card">
          <v-row align="center">
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                v-model="searchQuery"
                label="بحث بالاسم أو العنوان"
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="filterSpecialty"
                :items="specialtyOptions"
                label="التخصص"
                prepend-inner-icon="mdi-stethoscope"
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
        <div v-for="specialty in filteredSpecialties" :key="specialty.name" class="mb-8">
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
                    <div>
                      <v-card-title class="pa-0 text-body-1 font-weight-bold">
                        {{ doctor.name }}
                      </v-card-title>
                      <v-chip size="x-small" :color="specialty.color" variant="tonal" class="mt-1">
                        {{ specialty.name }}
                      </v-chip>
                    </div>
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
                </v-card-text>

                <v-card-actions class="px-4 pb-4 pt-0">
                  <v-btn
                    v-for="phone in doctor.phones"
                    :key="phone"
                    :href="`tel:${phone}`"
                    variant="tonal"
                    color="success"
                    size="small"
                    rounded="lg"
                    class="me-2 mb-1"
                  >
                    <v-icon start size="16">mdi-phone</v-icon>
                    {{ phone }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Empty state -->
        <v-card v-if="filteredSpecialties.length === 0" class="text-center py-12" rounded="xl">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-doctor</v-icon>
          <p class="text-h6 text-grey">لم يتم العثور على أطباء</p>
          <p class="text-body-2 text-grey-lighten-1">جرب تعديل البحث أو الفلاتر</p>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DoctorsPage',
  data() {
    return {
      searchQuery: '',
      filterSpecialty: null,
      specialties: [
        {
          name: 'نساء وتوليد',
          icon: 'mdi-human-pregnant',
          color: '#E91E63',
          doctors: [
            { name: 'د. أحمد عامر', address: 'السنطه أمام البنك الأهلي أعلى صيدلية أسماء', schedule: 'يومياً ما عدا الخميس والجمعة - الحجز مسبقاً', phones: ['01020526252'] },
            { name: 'د. بسمه غنيم', address: 'تطاي عند قهوة الحلواني', phones: ['01028395919'] },
            { name: 'د. رشا جاويش', address: 'السنطه شارع عبدالفتاح بركات', phones: ['01001805354'] },
            { name: 'د. أحمد جمال', address: 'تطاي بجوار الجمعية الزراعية', phones: ['01004348899'] },
            { name: 'د. سامية سند', address: 'السنطه شارع السمنودي بجوار مسجد السمنودي / الجعفرية أعلى صيدلية د. محمد صبحي', schedule: 'السبت والثلاثاء من 1 لـ 5', phones: ['01068382283'] },
          ]
        },
        {
          name: 'عيون',
          icon: 'mdi-eye',
          color: '#2196F3',
          doctors: [
            { name: 'د. صلاح ماهر', address: 'بجوار صيدلية د. عبد الحميد ورده', schedule: 'كل يوم ما عدا الأحد والأربعاء', phones: ['01020807426'] },
            { name: 'د. إيهاب أبو النور', address: 'السنطة ش الجمهورية - ميدان النافورة - أمام صيدلية السنطة الكبرى / الجعفرية بجوار صيدلية د. سامي ماضي', phones: ['01029508362'] },
            { name: 'د. همام حجازي', address: 'موقف الجعفرية القديم فوق صيدلية الشيخ', schedule: 'الأحد والثلاثاء والخميس من 1:30 لـ 5', phones: ['01060041669'] },
          ]
        },
        {
          name: 'أطفال',
          icon: 'mdi-baby-face-outline',
          color: '#4CAF50',
          doctors: [
            { name: 'د. عمرو خليل', address: 'سحيم شارع مستشفى سحيم / السنطه بجوار صيدلية سلام', schedule: 'كل يوم ما عدا الجمعة من بعد العشاء', phones: ['01095597406'] },
            { name: 'د. عبدالوهاب بدر', address: 'تطاي بجوار صيدلية د. عبدالحميد ورده', phones: ['01141977975', '01030497391'] },
            { name: 'د. أمال حامد عجرميه', address: 'تطاي بجوار مدرسة شوقي الرفاعي', schedule: 'الأحد والثلاثاء والخميس والجمعة', phones: ['01145190309'] },
            { name: 'د. أحمد شيحه', address: 'أعلى صيدلية د. علي أبو ليله', phones: ['01113638073'] },
            { name: 'د. عيد برهام', address: 'تطاي أمام ستوديو إيناس', phones: ['01095591344'] },
            { name: 'د. وائل البحيري', address: 'أمام مسجد القصار شارع ماكينة أبو سلامة', phones: ['0127173790'] },
            { name: 'د. أيمن شيحه', address: 'عند مكتب بريد تطاي القديم', phones: ['01005437717'] },
            { name: 'د. عزه زايد', address: 'طنطا أول البحر فوق ملك الموز', schedule: 'الاتصال مسبقاً - من 1', phones: ['01503223351', '01156291173'] },
            { name: 'د. خالد بدر', address: 'بركة السبع', phones: ['0482994602'] },
            { name: 'د. محمد زين', address: 'السنطه', schedule: 'كل يوم من 1 لـ 5', phones: ['01010317036'] },
            { name: 'د. أحمد سلطان', address: 'بركة السبع أمام ستوديو وحيد فريد', schedule: 'طوارئ 7 ص / صباحية حتى 6 مساءً / مسائية حتى 11 مساءً', phones: ['01004426262'] },
            { name: 'د. هبه الدسوقي', address: 'فوق صيدلية زقزوق', schedule: 'من 6 إلى 10 كل يوم ما عدا الجمعة', phones: ['01026244046'] },
            { name: 'د. أمل ياسر حنا', address: 'طنطا ش إبن مالك مع الشوربجي أمام اكوا الفلاتر', schedule: 'من الأحد للخميس من 12 لـ 3', phones: ['01202853388'] },
            { name: 'د. أميرة البردخيني', address: 'البدنجانية', phones: ['01061612447'] },
            { name: 'د. نبيلة', address: 'طنطا شارع سعيد مستشفى الأمريكان', phones: ['01147311755'] },
            { name: 'د. محمد حمزة', address: 'طنطا قدام الجامعة فوق مخبز العيش', phones: ['04032740440', '01001940046'] },
          ]
        },
        {
          name: 'جلدية',
          icon: 'mdi-hand-heart',
          color: '#9C27B0',
          doctors: [
            { name: 'د. نهير حسن مراد', address: 'الجعفرية أعلى صيدلية د. علي أبو ليله', schedule: 'السبت والاثنين والأربعاء من 7:30 لـ 11 مساءً', phones: ['01113638073'] },
            { name: 'د. محمد السلاموني', address: 'السنطه شارع بورسعيد أمام صيدلية سلام', phones: ['01272723654', '01015727798'] },
            { name: 'د. معتز الأقرع', address: 'السنطه برج الكرم', phones: ['01062924421'] },
            { name: 'د. نسرين البلتاجي', address: 'قصاد مستشفى راضي', phones: ['01210692100'] },
            { name: 'د. رحاب أحمد شبل', address: 'سحيم أمام مسجد سيدي جمال وصيدلية عباد الرحمن', schedule: 'يومياً ما عدا الجمعة من 3 لـ 7 مساءً', phones: ['01015137122'] },
          ]
        },
        {
          name: 'عظام',
          icon: 'mdi-bone',
          color: '#FF9800',
          doctors: [
            { name: 'د. محمد عبدالرحيم الشربيني', address: 'الجعفرية أعلى صيدلية د. علي أبو ليله', schedule: 'السبت والاثنين والخميس', phones: ['01007020582', '01064636317'] },
            { name: 'د. باسم بدوي', address: 'الجعفرية أعلى صيدلية د. محمد صبحي / ميت حواي بجوار جزارة أولاد حجاب', schedule: 'الخميس والجمعة والسبت من 7 لـ 9 / ميت حواي: الخميس والجمعة من 4 لـ 7', phones: ['01014239159'] },
            { name: 'د. محمد البشبيشي', address: 'السنطه فوق مول جني', schedule: 'الخميس والجمعة والسبت', phones: ['01026998253'] },
            { name: 'د. أحمد كرم جعفر', address: 'بجوار مستشفى الجعفرية', phones: ['01069744799'] },
          ]
        },
        {
          name: 'مخ وأعصاب',
          icon: 'mdi-brain',
          color: '#607D8B',
          doctors: [
            { name: 'د. عادل عبدالكريم', address: 'بركة السبع شارع مكتب الصحة القديم', phones: ['01112480327'] },
            { name: 'د. أسامة رجب', address: 'السنطه بجوار البنك الأهلي على طريق السنطه طنطا', schedule: 'كل يوم من 2 حتى 11 مساءً عدا الجمعة - الحجز مسبقاً', phones: ['01019984456'] },
            { name: 'د. مصطفى غرابه', address: 'طنطا شارع الجلاء برج الجلاء فوق النساجون الشرقيون', phones: ['01001607967', '01203705456'] },
            { name: 'د. مصطفى أبو الخير', address: 'طنطا ميدان ستوته عمارة التوحيد والنور / التأمين الطبي', phones: ['01004278453'] },
          ]
        },
        {
          name: 'صدر',
          icon: 'mdi-lungs',
          color: '#00BCD4',
          doctors: [
            { name: 'د. علا زهره', address: 'تطاي منطقة سيدي جمال', phones: ['01554149976'] },
          ]
        },
        {
          name: 'أنف وأذن',
          icon: 'mdi-ear-hearing',
          color: '#795548',
          doctors: [
            { name: 'د. أسامة غنيم', address: 'أعلى صيدلية د. محمد صبحي', schedule: 'السبت والاثنين والأربعاء والخميس من 7 لـ 10 مساءً', phones: ['01014704342'] },
            { name: 'د. خالد الحلو', address: 'بجوار صيدلية د. سامي ماضي', phones: ['01008720227'] },
            { name: 'د. محمد عبد المنصف النمر', address: 'السنطه كوبري الثانوي أمام المركز الطبي', schedule: 'من 8 لـ 1 / من 5 لـ 8', phones: ['01204327388', '01152119879'] },
            { name: 'د. عبدالحكيم عبدالغني', address: 'السنطه شارع الجمهورية فوق ماركت سنطاوي', phones: ['01062739531'] },
            { name: 'د. حمدي عبد الرحيم', address: 'مستشفى الأمريكان', schedule: 'السبت والاثنين والأربعاء والجمعة من 1 لـ 3 - الحجز مسبقاً', phones: [] },
          ]
        },
        {
          name: 'أسنان',
          icon: 'mdi-tooth-outline',
          color: '#3F51B5',
          doctors: [
            { name: 'د. هاله محمد شبل', address: 'تطاي بجوار قهوة الحلواني', schedule: 'يومياً ما عدا الجمعة والسبت من 5 لـ 11', phones: ['01015956504'] },
            { name: 'د. أحمد مصطفى الشريف', address: 'تاون مول أول البحر', phones: ['01226015006'] },
            { name: 'د. أحمد عبدالفتاح زهره', address: 'السنطه برج الأطباء الدور الأول أعلى النساجون الشرقيون', phones: ['01142477554'] },
            { name: 'د. ديوان أحمد جوده', address: 'تطاي أعلى صيدلية زقزوق بجوار الجامع الكبير', schedule: 'يومياً من 6 لـ 10:30 مساءً ما عدا الجمعة', phones: ['01123867371'] },
            { name: 'د. أحمد زيدان', address: 'السنطه خلف مستشفى راضي', phones: ['01115471086'] },
            { name: 'د. مالك جعفر', address: 'عند مستشفى الجعفرية', phones: ['01097334752'] },
            { name: 'د. أحمد هيبه', address: 'تطاي بعد الجمعية الزراعية بجوار منزل أ/عادل أنور', phones: ['01099727355'] },
            { name: 'د. مصطفى أحمد سليمان', address: 'الجعفرية بجوار د. ياسر الشلف', phones: [] },
          ]
        },
        {
          name: 'باطنة',
          icon: 'mdi-stomach',
          color: '#F44336',
          doctors: [
            { name: 'د. محمد فوزي خليل', address: 'أمام مركز شباب تطاي', schedule: 'كل يوم ما عدا الاثنين والثلاثاء من 5 لـ 9 مساءً / الجمعة من 6', phones: ['01070086850'] },
            { name: 'د. ياسر الشلف', address: 'السنطة أمام حلواني إسكندرية بعد البنك الأهلي / الجعفرية شارع السوق برج الريتاج', schedule: 'السنطة من 4 لـ 7 / الجعفرية من 7 لـ 11', phones: ['01004586595'] },
            { name: 'د. أحمد الحجري', address: 'شبراقاص', phones: ['01227528381'] },
            { name: 'د. عادل مجدي', address: 'الجعفرية بجوار صيدلية د. علي أبو ليلة', schedule: 'يومياً من 7 ما عدا الجمعة', phones: ['01068600175'] },
          ]
        },
        {
          name: 'علاج طبيعي',
          icon: 'mdi-human-handsup',
          color: '#009688',
          doctors: [
            { name: 'د. محمد عجرميه', address: 'تطاي بجوار مدرسة شوقي الرفاعي', schedule: 'السبت والاثنين والأربعاء من 3 عصراً', phones: ['01065777267'] },
          ]
        },
        {
          name: 'أخرى',
          icon: 'mdi-hospital-box',
          color: '#455A64',
          doctors: [
            { name: 'د. الجمال الخولي', address: 'طنطا شارع عثمان محمد', schedule: 'السبت إلى الأربعاء', phones: ['0403357500'] },
            { name: 'د. عبد الهادي طه', address: 'بركة السبع', phones: ['01005171381'] },
          ]
        }
      ]
    }
  },
  computed: {
    specialtyOptions() {
      return this.specialties.map(s => ({ title: s.name, value: s.name }))
    },
    filteredSpecialties() {
      let result = this.specialties

      if (this.filterSpecialty) {
        result = result.filter(s => s.name === this.filterSpecialty)
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
    totalDoctors() {
      return this.specialties.reduce((sum, s) => sum + s.doctors.length, 0)
    }
  },
  methods: {
    resetFilters() {
      this.searchQuery = ''
      this.filterSpecialty = null
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
