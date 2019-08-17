<template>
  <b-container style="margin-top:30px;padding-bottom:50px">
    <b-row>
      <b-col>
        <b-form>
          <b-form-group id="input-group-2" label="رقم الموبايل" label-for="input-2" align="right">
            <b-form-input
              id="input-2"
              v-model="hi"
              type="number"
              required
              style="max-width:500px"
              placeholder="من فضلك ادخل رقم الموبايل "
            ></b-form-input>
          </b-form-group>
          <b-button @click="getUser" variant="primary">تحقق من وجود المتبرع</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row style="margin-top:20px" v-if="user" align-h="center">
      <b-col style="max-width:500px">
        <b-card
          :title="user.name"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
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
        <b-form-group id="input-group-4" label=" : تاريخ أخر تبرع" label-for="input-4" align="right">
          <b-form-input
            id="input-4"
            v-model="when"
            type="date"
            required
            placeholder="من فضلك أدخل تاريخ أخر تبرع"
          ></b-form-input>
        </b-form-group>

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
      hi: "",
      user: null,
      when : null
    };
  },
  methods: {
    async getUser() {
      await axios
        .get(Db.apiUrl + this.hi)
        .then(res => {
          this.user = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async sendDonation(){
        await axios.put( Db.apiUrl + this.user._id , {
            when : this.when ,
            toWhom : "01558986000"

        }).then( res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }
  }
};
</script>
<style >
.container {
  font-family: myFirstFont;
}
</style>