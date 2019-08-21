<template>
  <div>
    <b-container
      fluid
      class
      style="background-image: linear-gradient(to top, #051937, #35255b, #722670, #b31771, #eb125d);; height:12rem"
    >
      <p id="ads" class="header-container">تبرعك بالدم ينقذ حياة</p>
    </b-container>
    <b-container>
      <br />
      <div v-if="!show" align="center">
        <font-awesome-icon :icon="myIcon" size="7x" style="color:green;" />
        <br />
        <br />
        <br />
        <strong style="font-size:larger;" class="text-success mt-2">done</strong>
      </div>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="Addform">
        <b-form-group id="input-group-2" label="* : الإسم" label-for="input-2" align="right">
          <b-form-input
            id="input-2"
            v-model="form.name"
            type="text"
            required
            placeholder="من فضلك ادخل الإسم ثلاثي"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-1"
          label=" : البريد الإليكتروني "
          label-for="input-1"
          size="sm"
          align="right"
        >
          <b-form-input
            id="input-1"
            v-model="form.contactInfo.mail"
            type="email"
            placeholder="يرجي إدخال بريد إليكترونى صالح"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-5"
          label="* : رقم الموبايل "
          label-for="input-5"
          align="right"
        >
          <b-form-input
            id="input-5"
            v-model="form.contactInfo.tel"
            type="number"
            required
            placeholder="رقم موبايل للتواصل"
          ></b-form-input>
        </b-form-group>

        <!-- <b-form-group
          id="input-group-6"
          label=" : الرقم القومي"
          label-for="input-6"
          :state="validation"
          align="right"
        >
          <b-form-input
            id="input-6"
            v-model="form.basicInfo.nationalId"
            type="number"
            required
            placeholder="من فضلك أدخل الرقم القومي"
          ></b-form-input>
          <b-form-invalid-feedback :state="validationID">يجب أن يكون الرقم القومى 14 رقم</b-form-invalid-feedback>
          <b-form-valid-feedback :state="validationID">تمام</b-form-valid-feedback>
        </b-form-group>-->

        <b-form-group
          id="input-group-4"
          label="* : تاريخ الميلاد"
          label-for="input-4"
          align="right"
        >
          <b-form-input
            id="input-4"
            v-model="form.basicInfo.birthDate"
            type="date"
            required
            placeholder="من فضلك أدخل تاريح ميلادك"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-3" label="* : الفصيلة " label-for="input-3" align="right">
          <b-form-select id="input-3" v-model="form.bloodType" :options="types" required></b-form-select>
        </b-form-group>
        <b-form-group id="input-group-7" label="* : النوع " label-for="input-7" align="right">
          <b-form-select id="input-7" v-model="form.gender" :options="genders" required></b-form-select>
        </b-form-group>
        <!-- <b-form-invalid-feedback
            :state="validationPhone"
            align="right"
          >رقم موبايل غير صحيح -- يجب أن يكون مكون من 11 رقما</b-form-invalid-feedback>
        <b-form-valid-feedback :state="validationPhone" align="right">تمام</b-form-valid-feedback>-->
        <p align="right" style="color:red" v-for="err in validationPhone"  :key="err" class="animated pulse">{{err}}  <font-awesome-icon :v-if="err" :icon="myIcon"/></p>
        <b-button class="m-1" type="submit" align="center" variant="primary">إرسال</b-button>
        <b-button class="m-1" type="reset" align="center" variant="danger">إعادة ملئ</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import Db from "../services/getDonors";
const axios = require("axios");
//let apiUrl = "http://localhost:5000/donor/";
//let apiUrl = "https://dry-spire-81070.herokuapp.com/donor/";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faSpinner,
  faCheck,
  faCheckCircle,
  faAmbulance,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Add",
  data() {
    return {
      myIcon: faTimes,
      form: {
        name: "",
        gender: "",
        bloodType: null,
        contactInfo: { tel: "", mail: "" },
        basicInfo: {
          nationalId: "",
          birthDate: null
        }
      },
      genders: [
        { text: "ذكر", value: "male" },
        { text: "أنثي", value: "female" }
      ],
      types: [
        { text: "A+", value: "A+" },
        { text: "O+", value: "O+" },
        { text: "B+", value: "B+" },
        { text: "AB+", value: "AB+" },
        { text: "A-", value: "A-" },
        { text: "O-", value: "O-" },
        { text: "AB-", value: "AB-" },
        { text: "B-", value: "B-" }
      ],
      show: true
    };
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    validationPhone() {
      let err = [];
            if (
        (this.form.name.length > 25 || this.form.name.length < 12 )
        && this.form.name
      ) {
        err[0] = " عدد حروف الإسم لا يقل عن 12 ولا يزيد عن 25";
      }
      if (
        this.form.contactInfo.tel.length !== 11 &&
        this.form.contactInfo.tel 
        && !(this.form.contactInfo.tel.slice(0, 2) != '01')
      ) {
        err[4] = " رقم موبايل غير صحيح";
      }
      let myDate = new Date(this.form.basicInfo.birthDate);
      let year = myDate.getFullYear();
      let month = myDate.getMonth();
      let day = myDate.getDate();
      let calc = new Date(year + 18, month, day);
      if (this.form.basicInfo.birthDate && calc > Date.now()) {
        err[2] = "  تاريخ ميلادك أصغر من ان تتبرع بالدم ";
      }
      return err.filter(h => {return h});
    }
  },
  methods: {
    async onSubmit(evt) {
      if (!this.validationPhone) {
        await axios.get(Db.apiUrl + this.form.contactInfo.tel).then(res => {
          //console.log(res.data)
          if (res.data) {
            this.$swal({
              text: "يوجد متبرع بنفس رقم الموبايل",
              type: "warning"
            });
          } else {
            evt.preventDefault();
            let element = {
              name: this.form.name,
              bloodType: this.form.bloodType,
              imgUrl: "Hi",
              contactInfo: {
                tel: this.form.contactInfo.tel,
                mail: this.form.contactInfo.mail
              },
              basicInfo: {
                //nationalId: this.form.basicInfo.nationalId,
                birthDate: this.form.basicInfo.birthDate,
                gender: this.form.gender
              }
            };
            axios
              .post(Db.apiUrl, element)
              .then(function(response) {
                console.log(response);
                alert("Added to dataBase");
              })
              .catch(function(error) {
                console.log(error);
                //alert(error.response.data);
              });

            this.show = false;
          }
        });
      } else {
        this.$swal({
          text: "خطأ في التسجيل",
          type: "warning"
        });
      }
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.type = null;

      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>

<style>
.Addform,
#ads {
  font-family: myFirstFont;
}
input {
  text-align: right;
  font-family: mySecFont;
  font-weight: bold;
}
.header-container {
  vertical-align: middle;
}
#ads {
  padding-top: 60px;
  color: white;
  font-size: xx-large;
}
</style>

