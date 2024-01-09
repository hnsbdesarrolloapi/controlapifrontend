<template>
  <q-dialog v-model="openDialog"
            persistent
            transition-show="scale"
            transition-hide="scale"
            position="top"
            @before-show="handleOpen">
    <q-card style="width: 600px;" class="x-dialog x-card">
      <q-card-section class="x-card-section-title">
        <div class="text-h6">{{ title }}</div>
        <q-btn icon="fa-light fa-xmark" flat round dense @click="closeDialog"/>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-8">
            <x-input label="App"
                     v-model="form.app"
                     :error="errors.app">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Usuario"
                     v-model="form.usuario"
                     :error="errors.usuario">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Clave"
                     v-model="form.clave"
                     :error="errors.clave">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="Url"
                     v-model="form.url"
                     :error="errors.url">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="Consulta básica"
                     v-model="form.query_basic"
                     :error="errors.query_basic">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="Consulta avanzada"
                     v-model="form.query_advanced"
                     :error="errors.query_advanced">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite básico"
                     v-model="form.limit_basic"
                     :error="errors.limit_basic">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite avanzado"
                     v-model="form.limit_advanced"
                     :error="errors.limit_advanced">
            </x-input>
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mt-md">
          <div class="col-24 text-right">
            <q-btn flat
                   no-caps
                   @click="closeDialog"
                   class="q-mr-sm">Cerrar</q-btn>
            <q-btn unelevated
                   color="primary"
                   no-caps
                   @click="onSubmit">Aceptar
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <x-loading :loading="loading"></x-loading>
    </q-card>
  </q-dialog>
</template>

<script>

import XInput from "components/XInput.vue";
import XLoading from "components/XLoading.vue";
import {useQuasar} from 'quasar';
import {ref, toRef} from "vue";
import {api} from "boot/axios";

export default {
  name: 'ReniecConfigurationForm',
  components: {XLoading, XInput},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    recordId: {
      required: true,
    },
  },
  setup(props, {emit}) {
    const $q = useQuasar();
    let resource = 'api/reniec_configurations';
    const openDialog = toRef(props, 'showDialog');
    let loading = ref(false);
    let title = ref('');
    let errors = ref({});
    let form = ref({});

    const initForm = () => {
      errors.value = {}
      form.value = {
        id: null,
        external_id: null,
        app: null,
        usuario: null,
        clave: null,
        url: null,
        query_basic: null,
        query_advanced: null,
        limit_basic: 1000,
        limit_advanced: 1000,
      }
    };

    const handleOpen = async () => {
      initForm();
      await getRecord();
    };

    const getRecord = async () => {
      loading.value = true;
      if (props.recordId) {
        await api.get(`/${resource}/record/${props.recordId}`)
          .then(response => {
            form.value = Object.assign({}, form.value, response.data.data);
          })
          .catch(error => {
            console.log(error);
          })
        title.value = `Editar configuración reniec`
      } else {
        title.value = `Nueva configuración reniec`
      }
      loading.value = false;
    };

    const onSubmit = async () => {
      loading.value = true;
      await api.post(`/${resource}`, form.value)
        .then(response => {
          let data = response.data;
          if (data.success) {
            $q.notify({type: 'success', message: data.message});
            emit('success');
            closeDialog();
          } else {
            $q.notify({type: 'error', message: data.message});
          }
        })
        .catch(error => {
          errors.value = error;
        })
      loading.value = false;
    };

    const closeDialog = () => {
      emit('update:showDialog', false);
    };

    return {
      loading,
      openDialog,
      title,
      form,
      errors,
      handleOpen,
      onSubmit,
      closeDialog
    }
  },
}
</script>
