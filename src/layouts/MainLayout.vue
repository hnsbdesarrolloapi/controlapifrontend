<template>
  <q-layout view="lHh LpR fFf">
    <q-header bordered class="bg-white text-grey-7">
      <q-toolbar>
        <q-btn flat
               dense
               round
               icon="fa-light fa-bars"
               aria-label="Menu"
               @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
        </q-toolbar-title>
        <div v-if="userData">{{ userData.name }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer class="drawer-menu"
              v-model="leftDrawerOpen"
              :width="220"
              show-if-above
              bordered>
      <div style="display: flex; height: 64px; width: 100%; justify-content: flex-start;
                  padding: 0 16px; align-items: center;">
        <q-img src="images/logo.png"
               fit="contain"
               style="max-width: 300px; max-height: 50px;"></q-img>
      </div>
      <q-list>
        <q-item-label header>
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item
          clickable
          @click.prevent="clickLogout">
          <q-item-section avatar>
            <q-icon name="fa-duotone fa-power-off"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Salir</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath"/>
    </q-page-container>
  </q-layout>
</template>

<script>

import {onMounted, computed, ref} from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import {useQuasar} from "quasar";
import {useRouter, useRoute} from 'vue-router';
import {api} from "boot/axios";

export default {
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    const $route = useRoute();
    const leftDrawerOpen = ref(false)
    const userData = ref(null);
    const linksList = ref([]);

    const clickLogout = () => {
      $q.dialog({
        title: 'Confirmar',
        message: 'Desea salir del sistema?',
        persistent: true,
        ok: {
          unelevated: true,
          color: 'primary',
          label: 'Si'
        },
        cancel: {
          outline: true,
          color: 'primary',
          label: 'No'
        },
      }).onOk(async () => {
        await api.post('/api/logout')
          .then(res => {
            $q.localStorage.remove('logged_in');
            $router.replace({name: 'login'});
          })
          .catch(() => {});
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    // const title = computed(() => {
    //   const path = $route.path;
    //   if (path === '/dashboard') {
    //     return 'Dashboard';
    //   }
    //   if (path === '/documents') {
    //     return 'Documentos';
    //   }
    //   if (path === '/summaries') {
    //     return 'Resúmenes';
    //   }
    //   if (path === '/companies') {
    //     return 'Empresas';
    //   }
    //   if (path === '/users') {
    //     return 'Usuarios';
    //   }
    //   if (path === '/configurations') {
    //     return 'Configuraciones';
    //   }
    // });

    onMounted(async () => {
      await api.get('/api/user/data')
        .then(res => {
          userData.value = res.data.user;
          linksList.value = res.data.menu
        })
        .catch(error => {
          $q.notify({type: 'error', message: error.message});
        });
    })

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      // title,
      userData,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      clickLogout
    }
  }
}
</script>
