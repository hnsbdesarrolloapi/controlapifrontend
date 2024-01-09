<template>
  <router-view />
</template>

<script>
import {useQuasar} from 'quasar'
import {onBeforeMount} from 'vue'

export default {
  name: 'App',
  setup() {
    const $q = useQuasar()
    onBeforeMount(async () => {
      $q.iconSet.arrow.dropdown = 'fa-light fa-chevron-down'
      $q.iconSet.expansionItem.icon = 'fa-light fa-chevron-down'
      $q.iconSet.table.warning = 'fa-light fa-triangle-exclamation'
      $q.iconSet.table.firstPage = 'fa-light fa-chevrons-left'
      $q.iconSet.table.prevPage = 'fa-light fa-chevron-left'
      $q.iconSet.table.lastPage = 'fa-light fa-chevrons-right'
      $q.iconSet.table.nextPage = 'fa-light fa-chevron-right'
      $q.iconSet.table.arrowUp = 'fa-light fa-chevron-up'
    })
  }
}
</script>
