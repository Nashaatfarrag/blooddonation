<template>
  <div class="container">
    <b-form-select v-model="selected" :options="options" class="mb-3" style="max-width=calc(12rem)">
      <!-- This slot appears above the options from 'options' prop -->
      <template slot="first">
        <option :value="null" disabled>-- Please select an option --</option>
      </template>
    </b-form-select>

    <!-- mapping donors data into donor element -->
    <b-card-group deck>
      <Donor v-for="donor in ( selected ? filtered : donors )" :donor="donor" :key="donor.id" />
    </b-card-group>
  </div>
</template>

<script>
// @ is an alias to /src
import Donor from "@/components/DonorElement.vue";
import Db from "../services/getDonors";
const axios = require("axios");
//let apiUrl = "http://localhost:5000/donor/";
let apiUrl = "https://dry-spire-81070.herokuapp.com/donor/";
export default {
  name: "home",
  data() {
    return {
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
      donors: []
    };
  },
  mounted() {
    //console.log(Db.getAll());
    this.getAll();
  },
  methods: {
    getAll: async function() {
      await axios
        .get(apiUrl)
        .then(response => {
          this.donors = response.data;
          //console.log(response.data ) ;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  computed: {
    filtered: function(selected) {
      return this.donors.filter(donor => donor.type === this.selected);
    }
  },
  components: {
    Donor
  }
};
</script>
