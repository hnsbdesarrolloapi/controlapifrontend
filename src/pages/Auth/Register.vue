<template>
  <div class="row justify-center full-height items-center">
    <div class="col-24 col-sm-15 col-md-9 col-lg-7 col-xl-6">
      <q-card flat v-if="form" class="x-card">
        <q-card-section class="x-card-section-title">
          <div class="flex items-center">
            <div class="col title">Registrarse</div>
          </div>
        </q-card-section>
        <q-card-section class="x-form-section-content">
          <form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-24">
                <x-input label="Nombre"
                         v-model="form.name"
                         :dense="false"
                         :error="errors.name"></x-input>
              </div>
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
                         :dense="false"
                         v-model="form.password_confirmation"
                         :error="errors.password_confirmation"></x-input>
              </div>
              <div class="col-24 text-center flex items-center justify-end">
                <q-item-label class="q-mr-lg" @click.prevent="goToLogin">
                  <span class="cursor-pointer">¿Ya estoy registrado?</span>
                </q-item-label>
                <q-btn unelevated
                       color="primary"
                       size="lg"
                       type="submit"
                       no-caps
                       :loading="loadingSubmit">Registrarse
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
  name: 'AuthRegister',
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
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      }
    }
    const onSubmit = async () => {
      loadingSubmit.value = true;
      errors.value = {};
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/register', form.value)
        .then(res => {
          if(res.status === 201) {
            $q.notify({type: 'success', message: 'La cuenta fue registrada satisfactoriamente, por favor valide su correo electrónico.'});
            $router.replace({name: 'login'});
          }
        })
        .catch(err => {
          errors.value = err;
        });
      loadingSubmit.value = false;
    }

    const goToLogin = () => {
      $router.replace({name: 'login'});
    }

    onMounted(async () => {
      await initForm();
    })

    return {
      loadingSubmit,
      title,
      errors,
      form,
      goToLogin,
      onSubmit
    }
  }
}
</script>
