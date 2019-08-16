<template>
  <div class="about">
    <p>This is an about page</p>
    <b-btn v-on:click="roure">Back to Add</b-btn>
  </div>
</template>
<script>
export default {
  methods : {
    roure : function(){
      this.$router.push('/add')
      console.log(this)
    }
  }
}
</script>
