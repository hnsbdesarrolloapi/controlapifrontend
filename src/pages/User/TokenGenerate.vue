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
            Por favor ingresar su contraseña para confirmar la operación.
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
  name: 'UserTokenGenerate',
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
    let resource = 'api/users';
    let title = ref('');
    let form = ref({});
    let errors = ref({});

    const initForm = () => {
      errors.value = {}
      form.value = {
        id: props.recordId,
        user_password: null
      }
    };

    const handleOpen = async () => {
      initForm();
      title.value = 'Generar Token'
    };

    const onSubmit = async () => {
      loading.value = true;
      await api.post(`/${resource}/generate_token`, form.value)
        .then(response => {
          let data = response.data;
          if (data.success) {
            $q.notify({type: 'success', message: data.message});
            emit('success', data.data);
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
