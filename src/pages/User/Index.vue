<template>
  <q-page class="q-px-lg q-pt-lg q-pb-none">
    <x-table-server ref="refStoreTableServer"
                    :title="title"
                    :resource="resource"
                    :show-filter="true"
                    :show-button-new="true"
                    @click-create="clickCreate()">
      <template v-slot:table-rows="{ props }">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col['name']" :props="props">
            <template v-if="col['name'] === 'actions'">
              <q-btn-dropdown
                no-caps dense outline
                split
                label="Editar"
                @click.prevent="clickCreate(props.row.id)">
                <q-list>
                  <q-item clickable
                          v-close-popup
                          v-if="props.row.is_active"
                          @click="clickState(props.row.id)">
                    <q-item-section>
                      <q-item-label>Desactivar</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable
                          v-close-popup
                          v-else
                          @click="clickState(props.row.id)">
                    <q-item-section>
                      <q-item-label>Activar</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable
                          v-close-popup
                          @click="clickGenerateToken(props.row.id)">
                    <q-item-section>
                      <q-item-label>Generar token</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </template>
            <template v-else>
              {{ props.row[col['name']] }}
            </template>
          </q-td>
        </q-tr>
      </template>
    </x-table-server>

    <user-form v-model:show-dialog="showDialogForm"
               :record-id="recordId"
               @success="successCreate"></user-form>

    <user-state v-model:show-dialog="showDialogState"
                :record-id="recordId"
                @success="successState"></user-state>

    <user-token-generate v-model:show-dialog="showDialogTokenGenerate"
                         :record-id="recordId"
                         @success="successTokenGenerate"></user-token-generate>
  </q-page>
</template>

<script>

import {ref} from "vue";
import XTableServer from "components/XTableServer.vue";
import UserState from "pages/User/State.vue";
import UserForm from "pages/User/Form.vue";
import UserTokenGenerate from "pages/User/TokenGenerate.vue";

export default {
  name: 'UserIndex',
  components: {UserTokenGenerate, UserForm, UserState, XTableServer},
  setup() {
    const refStoreTableServer = ref();
    let title = 'Listado de usuarios';
    let resource = 'api/users';
    let recordId = ref(null);
    let showDialogForm = ref(false);
    let showDialogState = ref(false);
    let showDialogTokenGenerate = ref(false);

    const clickCreate = (id = null) => {
      recordId.value = id;
      showDialogForm.value = true;
    }

    const clickState = (id) => {
      recordId.value = id;
      showDialogState.value = true;
    }

    const successCreate = () => {
      reloadRecords();
    }

    const successState = () => {
      reloadRecords();
    }

    const clickGenerateToken = async (id) => {
      recordId.value = id;
      showDialogTokenGenerate.value = true;
    };

    const successTokenGenerate = () => {
      reloadRecords();
    }

    const reloadRecords = () => {
      refStoreTableServer.value.tableRef.requestServerInteraction();
    }

    return {
      refStoreTableServer,
      title,
      resource,
      recordId,
      showDialogForm,
      showDialogState,
      showDialogTokenGenerate,
      clickCreate,
      clickState,
      clickGenerateToken,
      successCreate,
      successState,
      successTokenGenerate,
    }
  },
}
</script>
