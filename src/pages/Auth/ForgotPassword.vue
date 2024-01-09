<template>
  <div class="row justify-center full-height items-center">
    <div class="col-24 col-sm-15 col-md-9 col-lg-7 col-xl-6">
      <q-card flat v-if="form" class="x-card">
        <q-card-section class="x-card-section-title">
          <div class="flex items-center">
            <div class="col title">Recuperar contraseña</div>
          </div>
        </q-card-section>
        <q-card-section class="x-form-section-content">
          <form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-24">
                <div class="text-grey">
                  ¿Olvidaste tu contraseña? Ningún problema. Simplemente háganos saber su dirección de correo
                  electrónico
                  y le enviaremos un enlace de restablecimiento de contraseña que le permitirá elegir una nueva.
                </div>
              </div>
              <div class="col-24">
                <x-input label="Correo Electrónico"
                         v-model="form.email"
                         :dense="false"
                         :error="errors.email"></x-input>
              </div>
              <div class="col-24 text-center">
                <q-btn unelevated color="primary"
                       size="lg"
                       class="full-width login-submit"
                       type="submit"
                       no-caps
                       :loading="loadingSubmit">Enviar enlace
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
import {useRouter} from "vue-router";

export default {
  name: 'AuthForgotPassword',
  components: {XInput},
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    let loadingSubmit = ref(false);
    let title = ref('');
    let errors = ref({});
    let form = ref({});

    const initForm = () => {
      errors.value = {};
      form.value = {
        email: '',
      }
    }
    const onSubmit = async () => {
      loadingSubmit.value = true;
      errors.value = {};
      await api.post('/api/forgot-password', form.value)
        .then(res => {
          if(res.data.hasOwnProperty('error')) {
            $q.notify({type: 'error', message: res.data.error});
            $q.localStorage.set('logged_in', true);
            $router.replace({name: 'dashboard'});
          } else {
            $q.notify({type: 'success', message: 'Hemos enviado por correo electrónico su enlace de restablecimiento de contraseña.'});
          }
        })
        .catch(err => {
          errors.value = err
        });
      loadingSubmit.value = false;
    }

    onMounted(async () => {
      await initForm();
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
