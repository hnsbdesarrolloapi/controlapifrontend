<template>
  <q-page class="q-px-lg q-pt-lg q-pb-none">
    <div class="row q-col-gutter-lg" v-if="responseData">

    </div>
  </q-page>
</template>

<script>

import {ref, onMounted} from 'vue'
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import XDashCount from "components/XDashCount.vue";

export default {
  name: 'DashboardIndex',
  components: {XDashCount},
  setup() {
    const $q = useQuasar();
    let responseData = ref(null);

    onMounted(async () => {
      await api.get('/api/dashboard/data')
        .then(res => {
          responseData.value = res.data;
        })
        .catch(error => {
          $q.notify({type: 'error', message: error.message});
        });
    })

    return {
      responseData
    }
  }
}
</script>
