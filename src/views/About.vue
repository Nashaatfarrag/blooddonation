<template>
  <div class="container" style="padding-top:50px;padding-bottom:50px">
    
    <p  align="right">:تعليمات 
      <br>
      <br>
      يجب أن يكون سن المتبرع أكثر من 18 عاماً - 
      <br>
      يبقى الشخص غير متاح للتبرع لمدة 90 يوم للرجال و 120 يوم للنساء -
    </p>
    <b-btn v-on:click="roure">العودة إلى إضافة متبرع</b-btn>
  </div>
</template>
<script>
export default {
  methods : {
    roure : function(){
      this.$router.push('/add')
     
    }
  }
}
</script>
