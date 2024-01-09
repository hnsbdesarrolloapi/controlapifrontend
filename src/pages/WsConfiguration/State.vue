<template>
  <q-dialog v-model="openDialog"
            persistent
            transition-show="scale"
            transition-hide="scale"
            @before-show="handleOpen">
    <q-card style="width: 480px;" class="x-card">
      <q-card-section class="x-card-section-title">
        <div class="text-h6">{{ title }}</div>
        <q-icon name="close"
                class="icon-close cursor-pointer"
                @click.prevent="closeDialog"></q-icon>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-24">
            Por favor ingresar su contraseña para <span v-if="form.is_active">suspender</span><span v-else>activar</span> el registro
          </div>
          <div class="col-24">
            <x-input label="Contraseña"
                     type="password"
                     v-model="form.user_password"
                     :error="errors.user_password">
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
                   @click="onSubmit">Aceptar</q-btn>
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
  name: 'WsConfigurationState',
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
    const openDialog = toRef(props, 'showDialog');
    let loading = ref(false);
    let resource = 'api/ws_configurations';
    let title = ref('');
    let form = ref({});
    let errors = ref({});

    const initForm = () => {
      errors.value = {}
      form.value = {
        id: null,
        user_password: null
      }
    };

    const handleOpen = async () => {
      initForm();
      await getRecord();
    };

    const getRecord = async () => {
      loading.value = true;
      await api.get(`/${resource}/record/${props.recordId}`, form.value)
        .then(response => {
          form.value = Object.assign({}, form.value, response.data.data);
        })
        .catch(error => {
          console.log(error);
        })
      title.value = (form.value.is_active?'Suspender: ':'Activar: ')+form.value.url
      loading.value = false;
    };

    const onSubmit = async () => {
      loading.value = true;
      await api.post(`/${resource}/state`, form.value)
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
