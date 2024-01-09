<template>
  <div class="row justify-center full-height items-center">
    <div class="col-24 col-sm-15 col-md-9 col-lg-7 col-xl-6">
      <q-card flat v-if="form" class="x-card">
        <q-card-section class="x-card-section-title">
          <div class="flex items-center">
            <div class="col title">Iniciar sesión</div>
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
                         :dense="false"
                         v-model="form.password"
                         :error="errors.password"></x-input>
              </div>
              <div class="col-24 text-center flex items-center justify-end">
                <div class="flex column q-mr-lg">
<!--                  <q-item-label class="q-mb-sm" @click.prevent="goToForgotPassword">-->
<!--                    <span class="cursor-pointer">¿Olvidaste tu contraseña?</span>-->
<!--                  </q-item-label>-->
<!--                  <q-item-label @click.prevent="goToRegister">-->
<!--                    <span class="cursor-pointer">¿Quiero registrarme?</span>-->
<!--                  </q-item-label>-->
                </div>

                <q-btn unelevated
                       color="primary"
                       size="lg"
                       type="submit"
                       no-caps
                       :loading="loadingSubmit">Acceder
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
  name: 'AuthLogin',
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
        password: '',
        device_name: 'app_control_api',
      }
    }
    const onSubmit = async () => {
      loadingSubmit.value = true;
      errors.value = {};
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/login', form.value)
        .then(res => {
          $q.localStorage.set('logged_in', true);
          $router.replace({name: 'dashboard'});
        })
        .catch((err) => {
          errors.value = err;
        });
      loadingSubmit.value = false;
    }

    const goToForgotPassword = () => {
      $router.replace({name: 'forgot_password'});
    }

    const goToRegister = () => {
      $router.replace({name: 'register'});
    }

    onMounted(async () => {
      await initForm();
    })

    return {
      loadingSubmit,
      title,
      errors,
      form,
      goToForgotPassword,
      goToRegister,
      onSubmit
    }
  }
}
</script>
