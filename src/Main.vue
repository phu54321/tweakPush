<template lang='pug'>
nb-container
  nb-header
    nb-body
      nb-title TweakPush
  nb-content(v-if='debFiles.length > 0')
    nb-list-item(v-for='file in debFiles', @press='onDebClick(file)', :selected='isFileSelected(file)')
      nb-text(:style="{color: colorHash(file), paddingRight: 20}") ■
      nb-text {{file}}
  nb-content.container-no-deb(:padder='true', v-else, :contentContainerStyle="{ justifyContent: 'center', alignItems: 'center', flex: 1 }")
    nb-text(info) Oops... no deb files...

  nb-footer
    nb-footer-tab
      nb-button(@press='install', :variant='selectedFiles.length === 0 ? "secondary" : "primary"')
        nb-icon(name='download')
        nb-text(primary) Install
      nb-button(@press='respring')
        nb-icon(name='refresh')
        nb-text(warning) Respring
</template>

<script>

import * as Expo from 'expo'
import ColorHash from 'color-hash'

const colorHash = new ColorHash()

export default {
  data () {
    return {
      debFiles: [],
      selectedFiles: []
    }
  },
  async created () {
    this.debFiles = (await Expo.FileSystem.readDirectoryAsync('file:///var/mobile/Media/general_storage'))
      .filter(x => x.endsWith('.deb'))
  },
  methods: {
    colorHash (s) {
      return colorHash.hex(s)
    },
    onDebClick (file) {
      const index = this.selectedFiles.indexOf(file)
      if (index === -1) this.selectedFiles.push(file)
      else this.selectedFiles.splice(index, 1)
    },
    isFileSelected (file) {
      return this.selectedFiles.indexOf(file) !== -1
    }
  }
}
</script>

<style>

.container-no-deb {
  background-color: #eee;
}

</style>
