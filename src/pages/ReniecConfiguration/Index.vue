<template>
  <q-page class="q-px-lg q-pt-lg q-pb-none">
    <x-table-server ref="refStoreTableServer"
                    :title="title"
                    :resource="resource"
                    :show-filter="false"
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

    <reniec-configuration-form v-model:show-dialog="showDialogForm"
                             :record-id="recordId"
                             @success="successCreate"></reniec-configuration-form>

    <reniec-configuration-state v-model:show-dialog="showDialogState"
                              :record-id="recordId"
                              @success="successState"></reniec-configuration-state>
  </q-page>
</template>

<script>

import {ref} from "vue";
import XTableServer from "components/XTableServer.vue";
import ReniecConfigurationState from "pages/ReniecConfiguration/State.vue";
import ReniecConfigurationForm from "pages/ReniecConfiguration/Form.vue";

export default {
  name: 'ReniecConfigurationIndex',
  components: {ReniecConfigurationForm, ReniecConfigurationState, XTableServer},
  setup() {
    const refStoreTableServer = ref();
    let title = 'Listado de configuración reniec';
    let resource = 'api/reniec_configurations';
    let recordId = ref(null);
    let showDialogForm = ref(false);
    let showDialogState = ref(false);

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
      clickCreate,
      clickState,
      successCreate,
      successState
    }
  },
}
</script>
