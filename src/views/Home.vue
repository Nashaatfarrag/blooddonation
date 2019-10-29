<template>
  <div class="container" style="margin-top:40px;padding-bottom:60px">
    <b-form  v-if="show" class="Addform">
      <b-form-group id="input-group-2" label="OTP" label-for="input-2" align="center">
        <b-form-input
          id="input-2"
          v-model="OTP"
          type="text"
          required
          style="max-width:500px"
          placeholder="ادخل الكود السري لعرض بيانات المتبرعين"
        ></b-form-input>
        <p style="margin-top:10px">
          to have the OTP please contact the admin on :
          <br />01095848087
        </p>
      </b-form-group>
      <b-button class="m-1" @click="checkOTP" align="center" variant="primary">إرسال</b-button>
    </b-form>
    
    <div v-if="!show">
      إختر الفصيلة 
      <br>
      <b-form-select
        v-model="selected"
        :options="options"
        class="mb-3"
        style="max-width=calc(12rem)"
      >
      </b-form-select>

      <!-- mapping donors data into donor element -->
      <div v-if="!donors">
        <font-awesome-icon :icon="myIcon" spin />
      </div>
      <b-card-group v-else-if="donors" deck align="left">
        <Donor
          class="animated fadeInLeftBig"
          v-for="(donor,index) in ( selected ? filtered : donors )"
          :donor="donor"
          :key="donor.id"
          :style="myStyle(index)"
        />
      </b-card-group>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Donor from "@/components/DonorElement.vue";
import Db from "../services/getDonors";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const axios = require("axios");
//let apiUrl = "http://localhost:5000/donor/";
//let apiUrl = "https://tatayblooddonationapi.herokuapp.com/";

const { detect } = require("detect-browser");
const browser = detect();

export default {
  name: "home",
  data() {
    return {
      myIcon: faSpinner,
      selected: null,
      options: [
        { value: null, text: "All types" },
        { value: "O+", text: "O+" },
        { value: "A+", text: "A+" },
        { value: "B+", text: "B+" },
        { value: "AB+", text: "AB+" },
        { value: "O-", text: "O-" },
        { value: "A-", text: "A-" },
        { value: "B-", text: "B-" },
        { value: "AB-", text: "AB-" }
      ],
      donors: null,
      show: true,
      OTP: ""
    };
  },
  mounted() {
    //console.log(Db.getAll());
    this.getAll();
    this.hh();
  },
  methods: {
    checkOTP() {
      if (this.OTP === "hunter") {
        this.show = false;
      }
    },
    hh() {
      // handle the case where we don't detect the browser
      if (browser) {
        // console.log(browser.name);
        // console.log(browser.version);
        // console.log(browser.os);
        // if (browser.os === "Windows 10") {
          //console.log("hi");
          this.OTP = "hunter";
          this.checkOTP();
        
      }
    },
    getAll: async function() {
      axios
        .get(Db.apiUrl)
        .then(response => {
          this.donors = response.data;
          //console.log(response.data ) ;
        })
        .catch(function(error) {
          alert(error.errmsg);
        });
    },
    myStyle: function(index) {
      return "animation-delay : " + index * 500 + "ms";
    }
  },
  computed: {
    filtered: function(selected) {
      return this.donors.filter(donor => donor.bloodType === this.selected);
    }
  },
  components: {
    Donor
  }
};
</script>


<style scoped>
.ain {
  animation-duration: 3s;
  animation-delay: 2s;
  animation-iteration-count: infinite;
}
</style>
