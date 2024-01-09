import { Notify } from 'quasar'

Notify.registerType('success', {
  icon: 'fa-light fa-check',
  color: 'positive'
})

Notify.registerType('error', {
  icon: 'fa-light fa-xmark',
  color: 'negative'
})
