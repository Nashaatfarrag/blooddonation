<template>
  <v-container>
    <v-container style="margin-top: 30px; padding-bottom: 50px">
      <v-row>
        <v-col>
          <v-form>
            <v-text-field
              id="input-2"
              v-model="Phone"
              type="number"
              required
              style="max-width: 500px"
              label="رقم الموبايل"
              placeholder="من فضلك ادخل رقم الموبايل"
            />
            <v-btn @click="getUser" color="primary">تحقق من وجود المتبرع</v-btn>
          </v-form>
        </v-col>
      </v-row>
      <v-row style="margin-top: 20px" v-if="user" align="center">
        <v-col>
          <v-card style="max-width: 350px">
            <v-card-title>{{ user.name }}</v-card-title>
            <v-card-text>
              {{ user.contactInfo.tel }}<br />{{ user.contactInfo.mail }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="user">
        <v-col>
          <v-form>
            <v-text-field
              id="input-4"
              v-model="when"
              type="date"
              required
              label="تاريخ أخر تبرع"
              placeholder="من فضلك أدخل تاريخ أخر تبرع"
            />

            <v-text-field
              id="input-1"
              v-model="toWhom"
              type="number"
              label="هاتف الشخص المتبرع له"
              placeholder="رقم موبايل الشخص المريض"
            />

            <v-text-field
              id="input-3"
              v-model="OTP"
              type="number"
              required
              label="الكود التأكيدي"
              placeholder="الكود التأكيدي"
            />
          </v-form>
          <v-btn @click="sendDonation" color="primary">إرسال الطلب</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import Db from '../services/getDonors'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'addDonation',
  data() {
    return {
      hi: '01552',
      Phone: null,
      user: null,
      when: null,
      toWhom: null,
      OTP: '01552',
    }
  },
  methods: {
    async getUser() {
      try {
        const res = await axios.get(Db.apiUrl + this.Phone)
        this.user = res.data
      } catch (err) {
        console.log(err)
      }
    },

    async sendDonation() {
      if (this.OTP === this.hi) {
        const result = await Swal.fire({
          title: 'هل تريد الاستمرار؟',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'نعم',
          cancelButtonText: 'لا',
        })

        if (result.isConfirmed) {
          try {
            await axios.put(Db.apiUrl + this.user._id, {
              when: this.when,
              toWhom: this.toWhom,
            })
            this.$router.push('/')
          } catch (err) {
            console.log(err)
          }
        }
      } else {
        alert('كود تأكيدي خاطئ')
      }
    },
  },
}
</script>
<style>
.container {
  font-family: myFirstFont;
}
/* * {
  border: 1px solid red;
} */
</style>
