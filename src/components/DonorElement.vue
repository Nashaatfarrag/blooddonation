<template>
  <b-container class="mb-1 box-shadow" rounded="2" align="left">
    <b-row>
      <b-col class="m-2">
        <b-row v-animate-css="'rotateInUpLeft'">
          <h5 class>{{donor.name}}</h5>
        </b-row>
        <b-row>
          <p style="color:#999999">
            Age : {{donor.age}}
            <br />
            Type : {{donor.type}}
            <br />
            Tel : {{donor.tel}}
          </p>
        </b-row>
      </b-col>
      <b-col v-animate-css="'fadeIn'">
        <b-img
          rounded="circle"
          class="p-2"
          height="100"
          width="100"
          src="https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif"
          alt="Image 3"
        ></b-img>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "DonorElement",
  props: {
    msg: String,
    donor: Object
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
