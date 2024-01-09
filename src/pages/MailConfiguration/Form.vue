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
            <x-input label="Host"
                     v-model="form.host"
                     :error="errors.host">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Puerto"
                     v-model="form.port"
                     :error="errors.port">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Encriptación"
                     v-model="form.encryption"
                     :error="errors.encryption">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="Usuario"
                     v-model="form.username"
                     :error="errors.username">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="Contraseña"
                     v-model="form.password"
                     :error="errors.password">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="from_address"
                     v-model="form.from_address"
                     :error="errors.from_address">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="from_name"
                     v-model="form.from_name"
                     :error="errors.from_name">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite"
                     v-model="form.limit"
                     :error="errors.limit">
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
  name: 'MailConfigurationForm',
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
    let resource = 'api/mail_configurations';
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
        host: null,
        port: null,
        username: null,
        password: null,
        encryption: null,
        from_address: null,
        from_name: null,
        limit: 1000,
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
        title.value = `Editar configuración mail`
      } else {
        title.value = `Nueva configuración mail`
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
