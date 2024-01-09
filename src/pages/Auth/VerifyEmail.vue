<template>
  <div class="row justify-center full-height items-center">
    <div class="col-24 col-sm-15 col-md-9 col-lg-7 col-xl-6">
      <q-card flat class="x-card">
        <q-card-section class="x-card-section-title">
          <div class="flex items-center">
            <div class="col title">Verificar Correo Electrónico</div>
          </div>
        </q-card-section>
        <q-card-section class="x-form-section-content">
          <div class="row q-col-gutter-md">
            <div class="col-24">
              Gracias por registrarte! Antes de comenzar,
              ¿podría verificar su dirección de correo electrónico haciendo clic en el enlace que le acabamos de
              enviar?
              Si no recibiste el correo electrónico, con gusto te enviaremos otro.
            </div>
            <div class="col-24 text-center">
              <q-btn unelevated
                     color="primary"
                     size="lg"
                     class="full-width login-submit"
                     @click.prevent="resendEmail"
                     no-caps
                     :loading="loadingSubmit">Reenviar correo electrónico
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>

import {useQuasar} from "quasar";
import {ref} from "vue";
import {api} from 'boot/axios'
import {useRouter} from "vue-router";

export default {
  name: 'AuthVerifyEmail',
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    let loadingSubmit = ref(false);

    const resendEmail = async () => {
      loadingSubmit.value = true;
      await api.post('/api/email/verification-notification')
        .then(res => {
          console.log(res.status)
          if(res.status === 204) {
            $router.replace({name: 'dashboard'});
          } else if(res.status === 202) {
            $q.notify({type: 'success', message: 'El correo de verificación fue enviado satisfactoriamente.'});
          } else {
            console.log(res.status)
          }
        })
        .catch(error => {
          console.log(error);
        });
      loadingSubmit.value = false;
    }

    return {
      loadingSubmit,
      resendEmail
    }
  }
}
</script>
