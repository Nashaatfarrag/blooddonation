<template>
  <v-container style="padding: 30px">
    <v-row>
      <v-col>
        <v-select
          outlined
          label="إختر الفصيلة"
          v-model="selected"
          :items="options"
          item-title="text"
          item-value="value"
        ></v-select>

        <!-- mapping donors data into donor element -->
        <div v-if="!donors">
          <lottie-player
            src="https://assets10.lottiefiles.com/private_files/lf30_kzoKGW.json"
            background="transparent"
            speed="1"
            style="width: 100%; height: 100%"
            loop
            autoplay
          ></lottie-player>
          <!-- <font-awesome-icon :icon="myIcon" spin /> -->
        </div>
        <div v-else class="py-2">
          <v-data-table
            disable-sort
            :items="selected ? filtered : donors"
            :headers="tableHeaders"
            :page.sync="page"
            :items-per-page="7"
            hide-default-footer
            class="elevation-1"
            @page-count="pageCount = $event"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <a
                style="text-decoration: none"
                :href="`tel:${item.contactInfo.tel}`"
              >
                <v-icon color="primary">mdi-phone</v-icon>
              </a>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <p
                :style="
                  'color:' + (getStatus(item) === 'error' ? 'red' : 'green')
                "
              >
                {{ getStatus(item) === "error" ? "غير متاح" : "متاح" }}
              </p>
              <!-- <v-icon >mdi-account </v-icon> -->
            </template>
            <template v-slot:[`item.age`]="{ item }">
              {{ calcAge(item.basicInfo.birthDate) }}
            </template>
            <template v-slot:[`item.count`]="{ item }">
              {{ item.donationDates.length }}
            </template>
          </v-data-table>
        </div>
        <v-pagination
          v-on:input="anyMethod(page)"
          v-model="page"
          :length="pageCount"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Db from '../services/getDonors'
import axios from 'axios'

const page = ref(1)
const itemsPerPage = 7
const tableHeaders = [
  { value: 'name', text: 'الإسم' },
  { value: 'bloodType', text: 'الفصيلة' },
  { value: 'actions', text: 'إتصل' },
  { value: 'status', text: 'الحالة' },
  { value: 'age', text: 'العمر' },
  { value: 'count', text: 'عدد مرات التبرع' },
]
const selected = ref(null)
const options = [
  { value: null, text: 'كل الفصائل' },
  { value: 'O+', text: 'O+' },
  { value: 'A+', text: 'A+' },
  { value: 'B+', text: 'B+' },
  { value: 'AB+', text: 'AB+' },
  { value: 'O-', text: 'O-' },
  { value: 'A-', text: 'A-' },
  { value: 'B-', text: 'B-' },
  { value: 'AB-', text: 'AB-' },
]
const donors = ref(null)

const fetchDonors = async () => {
  try {
    const res = await axios.get(Db.apiUrl)
    donors.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchDonors()
})

function calcAge(val) {
  const x = new Date(val)
  return Math.floor((Date.now() - x) / 3600000 / 365 / 24)
}

function getStatus({ donationDates }) {
  let min = 100000
  donationDates.forEach((element) => {
    const x = new Date(element.when)
    const diff = Math.floor((Date.now() - x) / 3600000 / 24)
    min = diff < min ? diff : min
  })
  return min < 120 ? 'error' : 'success'
}

const filtered = computed(() => {
  if (!donors.value) return []
  return donors.value.filter((donor) => donor.bloodType === selected.value)
})

const pageCount = computed(() => {
  const total = selected.value ? filtered.value.length : (donors.value ? donors.value.length : 0)
  return Math.max(1, Math.ceil(total / itemsPerPage))
})

const displayed = computed(() => {
  const list = selected.value ? filtered.value : (donors.value || [])
  const start = (page.value - 1) * itemsPerPage
  return list.slice(start, start + itemsPerPage)
})

function anyMethod(_) {
  // analytics noop
}

function myStyle(index) {
  return `animation-delay : ${index * 500}ms`
}
</script>

<style scoped>
.ain {
  animation-duration: 3s;
  animation-delay: 2s;
  animation-iteration-count: infinite;
}
</style>
