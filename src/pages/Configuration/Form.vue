<template>
  <q-page class="q-px-lg q-pt-lg q-pb-none">
    <div class="row">
      <div class="col-24 col-sm-18 col-md-12 col-lg-10">
        <q-card flat v-if="form" class="x-card">
          <q-card-section class="x-card-section-title">
            <div class="flex items-center">
              <div class="title q-mb-sm">{{ title}}</div>
            </div>
          </q-card-section>
          <q-card-section class="x-form-section-content">
            <div class="row q-col-gutter-md">
              <div class="col-24">
                <x-input label="REFCON Usuario"
                         v-model="form.refcon_username"
                         :error="errors.refcon_username">
                </x-input>
              </div>
              <div class="col-24 text-right">
                <q-btn unelevated
                       color="primary"
                       no-caps
                       @click="onSubmit"
                       :loading="loading">Actualizar
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import XInput from "components/XInput.vue";
import {useQuasar} from "quasar";
import {ref, onMounted} from "vue";
import {api} from 'boot/axios'

export default {
  name: 'ConfigurationForm',
  components: {XInput},
  setup() {
    const $q = useQuasar();
    const refStoreTableServer = ref();
    let loading = ref(false);
    let title = 'Configuración';
    let resource = 'api/configurations';
    let errors = ref({});
    let form = ref({});

    onMounted(async () => {
      await getRecord()
    })

    const getRecord = async () => {
      loading.value = true;
      await api.get(`/${resource}/record`)
        .then(response => {
          form.value = Object.assign({}, form.value, response.data.data);
        })
        .catch(error => {
          console.log(error);
        })

      loading.value = false;
    };

    const onSubmit = async () => {
      loading.value = true;
      await api.post(`/${resource}`, form.value)
        .then(response => {
          let data = response.data;
          if (data.success) {
            $q.notify({type: 'success', message: data.message});
          } else {
            $q.notify({type: 'error', message: data.message});
          }
        })
        .catch(error => {
          errors.value = error;
        })

      loading.value = false;
    };

    return {
      refStoreTableServer,
      title,
      loading,
      form,
      errors,
      resource,
      onSubmit,
    }
  },
}
</script>
