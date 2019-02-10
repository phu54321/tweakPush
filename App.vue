<template lang='pug'>
main
</template>

<script>

import MainVue from './src/Main'

import Vue from 'vue-native-core'
import { VueNativeBase } from 'native-base'
Vue.use(VueNativeBase)

export default {
  components: {
    Main: MainVue
  }
}
</script>
