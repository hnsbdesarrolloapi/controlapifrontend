<template>
  <q-timeline color="secondary" style="min-height: 100px;">
    <q-timeline-entry v-for="(track, index) in records"
                      :key="index"
                      :title="track.title"
                      :subtitle="track.created_at"
                      :color="(track.status)?'positive':'negative'">
      <q-item dense v-ripple class="q-pa-none">
        <q-item-section>
          <q-item-label lines="1">Usuario: {{ track.user_name }} | Código:{{ track.code }}</q-item-label>
          <q-item-label>Mensaje: {{ track.message }}</q-item-label>
          <q-item-label v-if="track.notes">{{ track.notes }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-timeline-entry>
    <x-loading :loading="loading"></x-loading>
  </q-timeline>
</template>

<script>

import XLoading from "components/XLoading.vue";
import {onMounted, ref} from "vue";
import {api} from "boot/axios";

export default {
  name: "XTracking",
  components: {XLoading},
  props: {
    recordId: {
      required: true,
    },
  },
  setup(props) {
    let loading = ref(false);
    let records = ref([]);

    const initForm = () => {
      records.value = []
    };

    const getRecords = async () => {
      loading.value = true;
      await api.get(`/api/documents/tracking/${props.recordId}`)
        .then(response => {
          records.value = response.data;
        })
        .catch(error => {
          console.log(error);
        })
      loading.value = false;
    };

    onMounted(async () => {
      initForm();
      await getRecords();
    })

    return {
      loading,
      records
    }
  },
}
</script>
