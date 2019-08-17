<template>
  <b-container style="margin-top:30px;padding-bottom:50px">
    <b-row>
      <b-col>
        <b-form>
          <b-form-group id="input-group-2" label="رقم الموبايل" label-for="input-2" align="right">
            <b-form-input
              id="input-2"
              v-model="Phone"
              type="number"
              required
              style="max-width:500px"
              placeholder="من فضلك ادخل رقم الموبايل "
            ></b-form-input>
          </b-form-group>
          <b-button @click="getUser" type="submit" variant="primary">تحقق من وجود المتبرع</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row style="margin-top:20px" v-if="user" align="center">
      <b-col>
        <b-card
          style="max-width:350px"
          :title="user.name"
          img-alt="Image"
          img-top
          tag="article"
          class="mb-2"
        >
          <b-card-text>
            {{user.contactInfo.tel}}
            <br />
            {{user.contactInfo.mail}}
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-if="user">
      <b-col>
        <b-form>
          <b-form-group
            id="input-group-4"
            label=" * : تاريخ أخر تبرع"
            label-for="input-4"
            align="right"
          >
            <b-form-input
              id="input-4"
              v-model="when"
              type="date"
              required
              placeholder="من فضلك أدخل تاريخ أخر تبرع"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-1"
            label=" : هاتف الشخص المتبرع له"
            label-for="input-1"
            align="right"
          >
            <b-form-input
              id="input-1"
              v-model="toWhom"
              type="number"
              placeholder="رقم موبايل الشخص المريض"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-3"
            label=" * : الكود التأكيدي"
            label-for="input-3"
            align="right"
          >
            <b-form-input
              id="input-3"
              v-model="OTP"
              type="number"
              required
              placeholder="الكود التأكيدي"
            ></b-form-input>
          </b-form-group>
        </b-form>
        <b-button @click="sendDonation" variant="primary">إرسال الطلب</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Db from "../services/getDonors";
const axios = require("axios");

export default {
  name: "addDonation",
  data() {
    return {
      hi: "01552",
      Phone: null,
      user: null,
      when: null,
      toWhom: null,
      OTP: null
    };
  },
  methods: {
    async getUser() {
      await axios
        .get(Db.apiUrl + this.Phone)
        .then(res => {
          this.user = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    async sendDonation() {
      if (this.OTP === this.hi) {
        this.$swal({
          title: "هل تريد الاستمرار؟",
          type: "question",
          customClass: {
            icon: "swal2-arabic-question-mark"
          },
          confirmButtonText: "نعم",
          cancelButtonText: "لا",
          showCancelButton: true,
          showCloseButton: true
        }).then(result => {
          if (result.value) {
            //console.log(result.value);
            axios
              .put(Db.apiUrl + this.user._id, {
                when: this.when,
                toWhom: this.toWhom
              })
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
              });
          } else {
          }
        });
      } else {
        alert("كود تأكيدي خاطئ");
      }
    }
  }
};
</script>
<style >
.container {
  font-family: myFirstFont;
}
/* * {
  border: 1px solid red;
} */
</style>