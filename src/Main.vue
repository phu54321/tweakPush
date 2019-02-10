<template lang='pug'>
nb-container
  nb-header
    nb-left
      nb-button(:transparent='true', iconLeft, @press='showAbout()')
        nb-icon(name='information-circle-outline')
    nb-body
      nb-title TweakPush
    nb-right
  nb-content(v-if='debFiles.length > 0')
    nb-list-item(v-for='file in debFiles', @press='onDebClick(file)')
      nb-text(:style="{color: colorHash(file), paddingRight: 20}") ■
      nb-text {{file}}
  nb-content.container-no-deb(:padder='true', v-else, :contentContainerStyle="{ justifyContent: 'center', alignItems: 'center', flex: 1 }")
    nb-text(info) Oops... no deb files...

  nb-footer
    nb-footer-tab
      nb-button(@press='refreshList')
        nb-icon(name='refresh')
        nb-text(warning) Reload .deb files
      nb-button(@press='respring')
        nb-icon(name='power')
        nb-text(warning) Respring
</template>

<script>

import * as Expo from 'expo'
import ColorHash from 'color-hash'

const colorHash = new ColorHash()

export default {
  data () {
    return {
      debFiles: []
    }
  },
  async created () {
    this.refreshList()
  },
  methods: {
    colorHash (s) {
      return colorHash.hex(s)
    },
    onDebClick (file) {
      alert('Deb clicked: ' + file)
    },
    showAbout () {
      alert('TweakPush v1 by trgk')
    },
    async refreshList () {
      this.debFiles = (await Expo.FileSystem.readDirectoryAsync('file:///var/mobile/Media/general_storage'))
      // .filter(x => x.endsWith('.deb'))
    }
  }
}
</script>

<style>

.container-no-deb {
  background-color: #eee;
}

</style>
