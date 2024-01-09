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
          <div class="col-24">
            <x-input label="Nombre"
                     :readonly="!!recordId"
                     v-model="form.name"
                     :error="errors.name">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="Correo electrónico"
                     :readonly="!!recordId"
                     v-model="form.email"
                     :error="errors.email">
            </x-input>
          </div>
          <div class="col-24" v-if="!!recordId">
            <x-input label="Token"
                     :readonly="!!recordId"
                     v-model="form.api_token"
                     :error="errors.api_token">
            </x-input>
          </div>
          <div class="col-24">
            <x-input label="Descripción"
                     :autogrow="true"
                     v-model="form.description"
                     :error="errors.description">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite sms"
                     v-model="form.limit_sms"
                     :error="errors.limit_sms">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite mail"
                     v-model="form.limit_mail"
                     :error="errors.limit_mail">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite reniec básico"
                     v-model="form.limit_reniec_basic"
                     :error="errors.limit_reniec_basic">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite reniec avanzado"
                     v-model="form.limit_reniec_advanced"
                     :error="errors.limit_reniec_advanced">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite sis"
                     v-model="form.limit_sis"
                     :error="errors.limit_sis">
            </x-input>
          </div>
          <div class="col-8">
            <x-input label="Límite ws"
                     v-model="form.limit_ws"
                     :error="errors.limit_ws">
            </x-input>
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mt-md">
          <div class="col-24 text-right">
            <q-btn flat
                   no-caps
                   @click="closeDialog"
                   class="q-mr-sm">Cerrar
            </q-btn>
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
import UserTokenGenerate from "pages/User/TokenGenerate.vue";

export default {
  name: 'UserForm',
  components: {UserTokenGenerate, XLoading, XInput},
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
    let resource = 'api/users';
    const openDialog = toRef(props, 'showDialog');
    let loading = ref(false);
    let title = ref('');
    let errors = ref({});
    let form = ref({});

    const initForm = () => {
      errors.value = {}
      form.value = {
        id: null,
        name: null,
        email: null,
        api_token: null,
        description: null,
        limit_sms: 100,
        limit_mail: 100,
        limit_reniec_basic: 100,
        limit_reniec_advanced: 100,
        limit_sis: 100,
        limit_ws: 100
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
        title.value = `Editar usuario`
      } else {
        title.value = `Nueva usuario`
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
