<template>
  <div>
    <b-img
      src="https://www.awarenessdays.com/wp-content/uploads/2018/07/iStock-693244582-1024x683.jpg"
      fluid
      style="max-height:200px"
      alt="Responsive image"
    ></b-img>

    <b-container>
      <br />
      <div v-if="!show">
        <p>
          <i class="fas fa-check"></i> done
        </p>
      </div>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show" align="right" class="Addform">
        <b-form-group id="input-group-2" label="الإسم" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.name"
            required
            placeholder="من فضلك ادخل الإسم ثلاثي"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-1" label=" : البريد الإليكتروني " label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            required
            placeholder="يرجي إدخال بريد إليكترونى صالح"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-5" label=" : رقم الموبايل " label-for="input-5">
          <b-form-input
            id="input-5"
            v-model="form.tel"
            type="phone"
            required
            placeholder="رقم موبايل للتواصل"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-6" label=" : الرقم القومي" label-for="input-6">
          <b-form-input
            id="input-6"
            v-model="form.basicInfo.nationalId"
            type="phone"
            required
            placeholder="من فضلك أدخل الرقم القومي"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label=" : الفصيلة " label-for="input-3">
          <b-form-select id="input-3" v-model="form.type" :options="types" required></b-form-select>
        </b-form-group>

        <!-- <b-form-group id="input-group-4">
        <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
          <b-form-checkbox value="me">Check me out</b-form-checkbox>
          <b-form-checkbox value="that">Check that out</b-form-checkbox>
        </b-form-checkbox-group>
        </b-form-group>-->

        <b-button class="m-1" type="submit" variant="primary">Submit</b-button>
        <b-button class="m-1" type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import Db from "../services/getDonors";
export default {
  name: "Add",

  data() {
    return {
      // tel
      // mail
      // national
      // birth
      // bloodtype
      // name
      done: false,
      form: {
        email: "",
        name: "",
        tel: "",
        basicInfo: {
          nationalId: ""
        },
        type: null,
        checked: []
      },
      types: [
        { text: "Select One", value: null },
        "A+",
        "A-",
        "O+",
        "O-",
        "B+",
        "B-",
        "AB+",
        "AB-"
      ],
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      Db.add(this.form);
      this.show = false;
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
@font-face {
  font-family: myFirstFont;
  src: url("../font/HelveticaNeueW23forSKY-Bd.ttf");
}
.Addform {
  font-family: myFirstFont;
}
input {
  text-align: right;
  color: rgb(173, 170, 170);
}
</style>

