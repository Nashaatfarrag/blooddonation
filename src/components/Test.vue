<template>
  <div>
    <font-awesome-icon :icon="myIcon" spin/>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'MyComponent',

  data () {
    return {
      myIcon: faCheck
    }
  },

  components: {
    FontAwesomeIcon
  }
}
</script>