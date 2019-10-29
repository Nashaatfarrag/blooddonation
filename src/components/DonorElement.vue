<template>
  <b-container class="mb-2 box-shadow" rounded="2" align="left">
    <b-row>
      <b-col v-animate-css="'fadeIn'" class="col-4">
        <b-row class="text-center">
          <b-col>
            <font-awesome-icon
              style="font-size:60px ; color:#797979"
              class="m-3"
              :icon="donor.basicInfo.gender === 'male'? maleIcon: femaleIcon"
            />
          </b-col>
        </b-row>
        <b-row
          align="center"
          :class="(available === 'جديد' )? 'bg-dark': (available )? 'bg-success': 'bg-danger'"
        >
          <b-col
            style="color:white; font-family:myFirstFont"
          >{{(available === 'جديد' )? 'جديد': available ? 'متاح': "غير متاح"}}</b-col>
        </b-row>
        <b-row class="justify-content-center" style="padding-top:3px">
          <b-button
            size="sm"
            class="w-100 copy"
            variant="info"
            style="border-radius:0;"
            v-clipboard="donor.contactInfo.tel"
          >نسخ الرقم</b-button>
        </b-row>
      </b-col>
      <b-col class="m-2">
        <b-row class="animated">
          <h5 style="font-family:myFirstFont" class>{{donor.name}}</h5>
        </b-row>
        <b-row @click="toggleSelected">
          <p style="color:#433F40">
            Age : {{age}}
            <br />
            Type : {{donor.bloodType}}
            <br />
            Tel : {{donor.contactInfo.tel}}
            <br />
            Times : {{donor.donationDates.length}}
          </p>
          
        </b-row>
      </b-col>
    </b-row>
    <b-row v-if="selected" style="border-radius:10px" align="right">
      <b-col class="text-right">
        <b-row
          style="background-color:#E0E0E0; "
          class="p-1"
          v-for="donation in donor.donationDates"
          :key="donation._id"
          align="center"
        >
          <font-awesome-icon :icon="dateIcon" class="m-2" />
          <p class="m-1">{{" " +myDate(donation.when)}}</p>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {
  faSpinner,
  faGenderless,
  faMars,
  faFemale,
  faMale,
  faCalendar,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { delay } from "q";
import _ from "lodash";
export default {
  name: "DonorElement",
  data() {
    return {
      maleIcon: faMale,
      femaleIcon: faFemale,
      selected: false,
      dateIcon: faCheckCircle
    };
  },
  props: {
    msg: String,
    donor: Object,
    delay: Number
  },
  computed: {
    age: function() {
      let birthdate = new Date(this.donor.basicInfo.birthDate);
      return Math.floor((Date.now() - birthdate) / (3600 * 24 * 365 * 1000));
    },
    available: function() {
      if (this.donor.donationDates.length > 0) {
        return (
          (Date.now() -
            new Date(_.maxBy(this.donor.donationDates, "when").when)) /
            (1000 * 3600 * 24) >
          90
        );
      } else {
        return "جديد";
      }
    }
  },
  methods: {
    toggleSelected() {
      this.selected = !this.selected;
    },
    myDate: function(date) {
      //console.log(date)
      let hi = new Date(date);
      return (
        hi.getFullYear() + " - " + (hi.getMonth() + 1) + " - " + hi.getDate()
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* * {
  border: 1px red solid;
} */
.copy {
  font-family: myFirstFont;
}
.container {
  font-family: "Helvetica", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: white;
  /* color: whitesmoke; */
  border-radius: 8px;
  width: calc(18rem);
}

.box-shadow:hover {
  box-shadow: 0 5px 15px 2px rgba(0, 0, 0, 0.1);
}
</style>
