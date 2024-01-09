<template>
  <div class="row justify-center full-height items-center">
    <div class="col-24 col-sm-15 col-md-9 col-lg-7 col-xl-6">
      <q-card flat v-if="form" class="x-card">
        <q-card-section class="x-card-section-title">
          <div class="flex items-center">
            <div class="col title">Actualizar contraseña</div>
          </div>
        </q-card-section>
        <q-card-section class="x-form-section-content">
          <form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-24">
                <x-input label="Correo Electrónico"
                         v-model="form.email"
                         :dense="false"
                         :error="errors.email"></x-input>
              </div>
              <div class="col-24">
                <x-input label="Contraseña"
                         type="password"
                         v-model="form.password"
                         :dense="false"
                         :error="errors.password"></x-input>
              </div>
              <div class="col-24">
                <x-input label="Confirmar Contraseña"
                         type="password"
                         v-model="form.password_confirmation"
                         :dense="false"
                         :error="errors.password_confirmation"></x-input>
              </div>
              <div class="col-24 text-center">
                <q-btn unelevated color="primary"
                       size="lg"
                       class="full-width login-submit"
                       type="submit"
                       no-caps
                       :loading="loadingSubmit">Actualizar
                </q-btn>
              </div>
            </div>
          </form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>

import XInput from "components/XInput.vue";
import {useQuasar} from "quasar";
import {ref, onMounted} from "vue";
import {api} from 'boot/axios'
import {useRoute, useRouter} from "vue-router";

export default {
  name: 'AuthResetPassword',
  components: {XInput},
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    const $route = useRoute();
    let loadingSubmit = ref(false);
    let title = ref('');
    let errors = ref({});
    let form = ref({});

    const initForm = () => {
      errors.value = {};
      form.value = {
        email: '',
        password: '',
        password_confirmation: '',
        token: '',
      }
    }
    const onSubmit = async () => {
      loadingSubmit.value = true;
      errors.value = {};
      await api.post('/api/reset-password', form.value)
        .then(res => {
            $q.notify({type: 'success', message: 'Tu contraseña ha sido restablecida.'});
            $router.replace({name: 'login'});
        })
        .catch(err => {
          errors.value = err;
        });
      loadingSubmit.value = false;
    }

    onMounted(async () => {
      await initForm();
      form.value.token = $route.params.token;
    })

    return {
      loadingSubmit,
      title,
      errors,
      form,
      onSubmit
    }
  }
}
</script>
