<template>
  <b-container class="mb-2 box-shadow" rounded="2" align="left" >
    <b-row>
      <b-col v-animate-css="'fadeIn'" class="col-4">
        <b-img
          rounded="circle"
          class="mt-2"
          height="70"
          width="70"
          src="https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif"
          alt="Image 3"
        ></b-img>
      </b-col>
      <b-col class="m-2">
        <b-row class="animated ">
          <h5 style="font-family:myFirstFont" class>{{donor.name}}</h5>
        </b-row>
        <b-row>
          <p style="color:#A7A7A7">
            Age : {{age}}
            <br />
            Type : {{donor.bloodType}}
            <br />
            Tel : {{donor.contactInfo.tel}}
          </p>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { delay } from 'q';

export default {
  name: "DonorElement",
  props: {
    msg: String,
    donor: Object,
  delay : Number
  },
  computed:{
    age : function(){
      let birthdate = new Date( this.donor.basicInfo.birthDate );
      return(Math.floor((Date.now() - birthdate) / ( 3600 * 24 *365 *1000)) );
  
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* * {
  border: 1px red solid;
} */

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
