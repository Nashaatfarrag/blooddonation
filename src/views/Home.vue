<template>
  <v-container style="padding: 30px">
    <v-row>
      <v-col>
        <v-select
          outlined
          label="إختر الفصيلة"
          v-model="selected"
          :items="options"
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

<script>
import Db from "../services/getDonors";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      pageCount: 0,
      page: 1,
      tableHeaders: [
        { value: "name", text: "الإسم" },
        { value: "bloodType", text: "الفصيلة" },
        { value: "actions", text: "إتصل" },
        { value: "status", text: "الحالة" },
        { value: "age", text: "العمر" },
        { value: "count", text: "عدد مرات التبرع" },
      ],
      myIcon: faSpinner,
      selected: null,
      options: [
        { value: null, text: "كل الفصائل" },
        { value: "O+", text: "O+" },
        { value: "A+", text: "A+" },
        { value: "B+", text: "B+" },
        { value: "AB+", text: "AB+" },
        { value: "O-", text: "O-" },
        { value: "A-", text: "A-" },
        { value: "B-", text: "B-" },
        { value: "AB-", text: "AB-" },
      ],
      donors: null,
      show: true,
      OTP: "",
    };
  },
  mounted() {
    this.getAll();
  },
  methods: {
    anyMethod(input) {
      this.$gtag.event("changeTablePage", {
        event_category: "Click",
        event_label: "Change Page",
        value: input,
      });
    },
    calcAge(val) {
      let x = new Date(val);

      return Math.floor((Date.now() - x) / 3600000 / 365 / 24);
    },
    getStatus({ donationDates }) {
      let min = 100000;
      donationDates.forEach((element) => {
        let x = new Date(element.when);
        let diff = Math.floor((Date.now() - x) / 3600000 / 24);

        min = diff < min ? diff : min;
      });

      return min < 120 ? "error" : "success";
    },
    getAll: async function () {
      axios
        .get(Db.apiUrl)
        .then((response) => {
          this.donors = response.data;
        })
        .catch(function (error) {
          alert(error.errmsg);
        });
    },
    myStyle: function (index) {
      return "animation-delay : " + index * 500 + "ms";
    },
  },
  computed: {
    filtered: function () {
      return this.donors.filter((donor) => donor.bloodType === this.selected);
    },
  },
};
</script>

<style scoped>
.ain {
  animation-duration: 3s;
  animation-delay: 2s;
  animation-iteration-count: infinite;
}
</style>
