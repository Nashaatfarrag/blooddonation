<template>
  <v-row>
    <v-container fluid id="grad-container">
      <v-row style="  height: 15rem;" align="center" justify="center">
        <v-col>
          <p id="ads" class="header-container">تبرعك بالدم ينقذ حياة</p>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row justify="center">
        <v-col md="10">
          <v-form @reset="onReset" v-if="show" class="Addform">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  @input="$v.form.name.$touch()"
                  @blur="$v.form.name.$touch()"
                  :error-messages="generateErrors($v.form.name)"
                  label="* : الإسم"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="من فضلك ادخل الإسم ثلاثي"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  @input="$v.form.contactInfo.mail.$touch()"
                  @blur="$v.form.contactInfo.mail.$touch()"
                  :error-messages="
                    generateErrors($v.form.contactInfo.mail, 'Email')
                  "
                  label=" : البريد الإليكتروني "
                  v-model="form.contactInfo.mail"
                  type="email"
                  placeholder="يرجي إدخال بريد إليكترونى صالح"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  @input="$v.form.contactInfo.tel.$touch()"
                  @blur="$v.form.contactInfo.tel.$touch()"
                  :error-messages="generateErrors($v.form.contactInfo.tel)"
                  label="* : رقم الموبايل "
                  v-model="form.contactInfo.tel"
                  type="number"
                  required
                  placeholder="رقم موبايل للتواصل"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  @input="$v.form.basicInfo.birthDate.$touch()"
                  @blur="$v.form.basicInfo.birthDate.$touch()"
                  :error-messages="generateErrors($v.form.basicInfo.birthDate)"
                  label="* : تاريخ الميلاد"
                  v-model="form.basicInfo.birthDate"
                  type="date"
                  required
                  placeholder="من فضلك أدخل تاريح ميلادك"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  outlined
                  @input="$v.form.bloodType.$touch()"
                  @blur="$v.form.bloodType.$touch()"
                  :error-messages="generateErrors($v.form.bloodType)"
                  label="* : الفصيلة "
                  v-model="form.bloodType"
                  :items="types"
                  required
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  outlined
                  @input="$v.form.gender.$touch()"
                  @blur="$v.form.gender.$touch()"
                  :error-messages="generateErrors($v.form.gender)"
                  label="* : النوع "
                  v-model="form.gender"
                  :items="genders"
                  required
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn
                  class="ma-1"
                  type="button"
                  @click="onSubmit"
                  align="center"
                  color="primary"
                  >إرسال</v-btn
                >
                <v-btn class="ma-1" type="reset" align="center" color="danger"
                  >إعادة ملئ</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
      <br />
      <div v-if="!show" align="center">
        <font-awesome-icon :icon="myIcon" size="7x" style="color: green" />
        <br />
        <br />
        <br />
        <strong style="font-size: larger" class="text-success mt-2"
          >done</strong
        >
      </div>
    </v-container>
  </v-row>
</template>

<script>
import Db from "../services/getDonors";
const axios = require("axios");
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  minLength,
} from "vuelidate/lib/validators";
//let apiUrl = "http://localhost:5000/donor/";
//let apiUrl = "https://dry-spire-81070.herokuapp.com/donor/";
import {
  FieldErrors,
  UniqueFieldErrors,
  NotReqEmailErrors,
} from "@/utils/validation";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Add",
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(32),
        minLength: minLength(8),
      },
      gender: {
        required,
        maxLength: maxLength(10),
        minLength: minLength(3),
      },
      bloodType: {
        required,
        maxLength: maxLength(10),
        minLength: minLength(1),
      },
      contactInfo: {
        tel: { required, maxLength: maxLength(11), minLength: minLength(8) },
        mail: { email },
      },
      basicInfo: {
        nationalId: "",
        birthDate: {
          required,
          maxLength: maxLength(10),
          minLength: minLength(8),
        },
      },
    },
  },
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
          birthDate: null,
        },
      },
      genders: [
        { text: "ذكر", value: "male" },
        { text: "أنثي", value: "female" },
      ],
      types: [
        { text: "A+", value: "A+" },
        { text: "O+", value: "O+" },
        { text: "B+", value: "B+" },
        { text: "AB+", value: "AB+" },
        { text: "A-", value: "A-" },
        { text: "O-", value: "O-" },
        { text: "AB-", value: "AB-" },
        { text: "B-", value: "B-" },
      ],
      show: true,
    };
  },
  components: {
    FontAwesomeIcon,
  },
  methods: {
    generateErrors(val, filedType, fieldValue) {
      if (filedType === "Email") return NotReqEmailErrors(val);
      else if (filedType === "UniqueField")
        return UniqueFieldErrors(val, this.validateDuplicate(fieldValue));
      else return FieldErrors(val);
    },
    async onSubmit(evt) {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        axios.get(Db.apiUrl + this.form.contactInfo.tel).then((res) => {
          //console.log(res.data)
          if (res.data) {
            this.$swal({
              text: "يوجد متبرع بنفس رقم الموبايل",
              type: "warning",
            });
          } else {
            evt.preventDefault();
            let element = {
              name: this.form.name,
              bloodType: this.form.bloodType,
              imgUrl: "Hi",
              contactInfo: {
                tel: this.form.contactInfo.tel,
                mail: this.form.contactInfo.mail,
              },
              basicInfo: {
                //nationalId: this.form.basicInfo.nationalId,
                birthDate: this.form.basicInfo.birthDate,
                gender: this.form.gender,
              },
            };
            axios.post(Db.apiUrl, element).finally(() => {
              this.show = false;
            });
          }
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
    },
  },
};
</script>

<style>
#grad-container {
  background-image: linear-gradient(
    to top,
    #051937,
    #35255b,
    #722670,
    #b31771,
    #eb125d
  );

  text-align: center;
}
.Addform,
#ads {
  font-family: myFirstFont;
}
input {
  text-align: right;
  font-family: mySecFont;
  font-weight: bold;
}

#ads {
  color: white;
  font-size: 2rem;
}
</style>
