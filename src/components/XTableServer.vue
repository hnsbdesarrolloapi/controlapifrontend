<template>
  <q-card flat style="margin-top: 0;" class="x-table-card">
    <q-card-section class="x-table-section-title q-mb-md" v-if="showSectionTitle">
      <div class="flex items-center">
        <div class="col title">{{ title }}</div>
        <div class="col-shrink flex items-center">
          <slot name="button-actions"></slot>
          <q-btn outline
                 icon="fa-light fa-plus"
                 color="primary"
                 class="q-mr-sm"
                 no-caps
                 @click.prevent="clickCreate()"
                 v-if="showButtonNew"><span class="q-ml-sm">Nuevo</span>
          </q-btn>
          <q-btn outline
                 no-caps
                 icon="fa-light fa-columns-3"
                 v-if="showButtonColumns"><span class="q-ml-sm">Columnas</span>
            <q-menu class="q-pa-sm">
              <q-option-group
                :options="selectColumns"
                type="checkbox"
                v-model="selectVisibleColumns"></q-option-group>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="showFilter" class="x-table-section-filters q-mb-md">
      <div class="row q-col-gutter-x-sm q-col-gutter-y-sm">
        <template v-for="f in filters">
          <div :class="f.class" v-if="f.type === 'select'">
            <q-select v-model="f.value"
                      :label="f.label"
                      :options="f.options"
                      option-value="id"
                      option-label="name"
                      emit-value
                      map-options
                      outlined
                      dense
                      options-dense
                      :multiple="f.multiple"
                      :clearable="f.clearable"
                      class="select-truncate"
                      @update:model-value="changeFilter"></q-select>
          </div>
          <div :class="f.class" v-if="f.field === 'period'">
            <div class="row q-col-gutter-x-sm q-col-gutter-y-sm">
              <div class="col" v-if="f.options.length > 1">
                <q-select v-model="f.value"
                          :label="f.label"
                          :options="f.options"
                          option-value="id"
                          option-label="name"
                          emit-value
                          map-options
                          outlined
                          dense
                          options-dense
                          class="select-truncate"
                          @update:model-value="changeFilter"></q-select>
              </div>
              <template v-if="f.value === 'date' || f.value === 'between_dates'">
                <div class="col">
                  <q-field label="Fecha del" outlined dense stack-label class="x-datepicker">
                    <template v-slot:control>
                      <datepicker v-model="f.date_start"
                                  format="dd/MM/yyyy"
                                  modelType="yyyy-MM-dd"
                                  :enableTimePicker="false"
                                  :clearable="false"
                                  autoApply
                                  @update:model-value="changeFilter"></datepicker>
                    </template>
                  </q-field>
                </div>
              </template>
              <template v-if="f.value === 'between_dates'">
                <div class="col">
                  <q-field label="Fecha al" outlined dense stack-label class="x-datepicker">
                    <template v-slot:control>
                      <datepicker v-model="f.date_end"
                                  format="dd/MM/yyyy"
                                  modelType="yyyy-MM-dd"
                                  :enableTimePicker="false"
                                  :clearable="false"
                                  autoApply
                                  @update:model-value="changeDateEnd"></datepicker>
                    </template>
                  </q-field>
                </div>
              </template>
              <template v-if="f.value === 'month' || f.value === 'between_months'">
                <div class="col">
                  <q-field label="Mes del" outlined dense stack-label class="x-datepicker">
                    <template v-slot:control>
                      <datepicker v-model="f.month_start"
                                  monthPicker
                                  :enableTimePicker="false"
                                  :clearable="false"
                                  autoApply
                                  @update:model-value="changeFilter"></datepicker>
                    </template>
                  </q-field>
                </div>
              </template>
              <template v-if="f.value === 'between_months'">
                <div class="col">
                  <q-field label="Mes al" outlined dense stack-label class="x-datepicker">
                    <template v-slot:control>
                      <datepicker v-model="f.month_end"
                                  monthPicker
                                  :enableTimePicker="false"
                                  :clearable="false"
                                  autoApply
                                  @update:model-value="changeFilter"></datepicker>
                    </template>
                  </q-field>
                </div>
              </template>
            </div>
          </div>
          <div :class="f.class" v-if="f.type === 'input'">
            <q-input :label="f.label"
                     outlined
                     dense
                     v-model="f.value"
                     debounce="750"
                     autocomplete="off"
                     aria-autocomplete="off"
                     @update:model-value="changeFilter">
              <template v-slot:append>
                <q-icon name="fa-light fa-search" size="xs"/>
              </template>
            </q-input>
          </div>
          <div :class="f.class" v-if="f.type === 'select_items'">
            <q-select :label="f.label"
                      outlined
                      dense
                      options-dense
                      v-model="f.value"
                      clearable
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="750"
                      :options="items"
                      option-value="id"
                      option-label="name"
                      emit-value
                      map-options
                      @filter="filterFn"
                      @update:model-value="changeFilter"
                      style="width: 100%">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </template>
      </div>
    </q-card-section>
    <q-card-section v-if="header && header.length > 0" class="x-table-section-header">
      <div class="row">
        <div class="col-12 col-sm text-center column" v-for="hcol in header">
          <div class="text-weight-medium" style="margin-top: 4px">{{ hcol.label }}</div>
          <div class="text-weight-medium" style="font-size: 24px; margin-top: 4px">{{ hcol.value }}</div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="x-table-section-content">
      <q-table ref="tableRef"
               :rows="records"
               :columns="columns"
               :loading="loading"
               v-model:pagination="pagination"
               :visible-columns="visibleColumns"
               flat
               dense
               row-key="id"
               @request="onRequest"
               binary-state-sort
               class="table-index">
        <template v-slot:body="props">
          <slot name="table-rows" :props="props"></slot>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {api} from "boot/axios";
import {computed, onMounted, ref} from "vue";
import _ from "lodash";

export default {
  name: 'XTableServer',
  components: {Datepicker},
  props: {
    title: {
      type: String,
      required: true,
    },
    resourceInit: {
      default: null,
    },
    resource: {
      type: String,
      required: true,
    },
    showSectionTitle: {
      type: Boolean,
      default: true
    },
    showFilter: {
      type: Boolean,
      default: false
    },
    showButtonNew: {
      type: Boolean,
      default: true
    },
    showButtonColumns: {
      type: Boolean,
      default: true
    },
    additionalFilters: {
      type: Array,
      default: []
    }
  },
  setup(props, {emit}) {
    const tableRef = ref();
    let loading = ref(false);
    let columns = ref([]);
    let filters = ref([]);
    let lockedColumns = ref([]);
    let records = ref([]);
    let pagination = ref({
      sortBy: null,
      descending: null,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10
    });
    let selectVisibleColumns = ref([]);
    let selectColumns = ref([]);
    let header = ref([]);
    let items = ref([]);

    const visibleColumns = computed(() => {
      return lockedColumns.value.concat(selectVisibleColumns.value)
    });

    const initTableServer = () => {
      pagination.value = {
        sortBy: null,
        descending: null,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      };
    }

    const getInitTable = async () => {
      loading.value = true;
      let resourceInit = (!props.resourceInit) ? props.resource : props.resourceInit;
      await api.get(`/${resourceInit}/init_data_table`)
        .then(response => {
          columns.value = response.data.columns;
          filters.value = response.data.filters;
          lockedColumns.value = response.data.locked_columns;
          pagination.value.sortBy = response.data.pagination.sort_by;
          pagination.value.descending = response.data.pagination.descending;
          pagination.value.rowsPerPage = response.data.pagination.limit;
        });
      getVisibleColumns();
      loading.value = false;
    }

    const getVisibleColumns = () => {
      columns.value.forEach(col => {
        if (!lockedColumns.value.includes(col.name)) {
          selectColumns.value.push({
            'label': col.label,
            'value': col.name,
          });
          selectVisibleColumns.value.push(col.name);
        }
      })
    }

    const onRequest = async (data) => {
      const {page, rowsPerPage, sortBy, descending} = data.pagination
      const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
      loading.value = true;
      records.value = [];

      await api.post(`/${props.resource}/records`, {
        'page': page,
        'limit': fetchCount,
        'sortBy': sortBy,
        'descending': descending,
        'filters': filters.value.concat(props.additionalFilters),
      })
        .then(response => {
          let data = response.data;
          records.value = data.data;
          header.value = data.header;
          pagination.value.page = data.meta.current_page
          pagination.value.rowsPerPage = data.meta.per_page
          pagination.value.rowsNumber = data.meta.total
          pagination.value.sortBy = data.meta.sort_by
          pagination.value.descending = data.meta.descending
        });
      loading.value = false;
    }

    const changeFilter = async () => {
      await onRequest({pagination: pagination.value});
    }

    const changeDateEnd = () => {
      let period = _.find(filters.value, {'field': 'period'});
      if (period.date_end < period.date_start) {
        period.date_end = period.date_start;
      }
      changeFilter();
    }

    const filterFn = (val, update, abort) => {
      update(() => {
          if (val !== '') {
            api.post(`/store/item_options`, {
              'search': val,
              'category_id': 'all',
            })
              .then(res => {
                items.value = res.data
              })
          }
        },
      )
    }

    const clickCreate = (value) => {
      emit('click-create', value)
    }

    onMounted(async () => {
      initTableServer();
      await getInitTable();
      tableRef.value.requestServerInteraction();
    })

    return {
      loading,
      tableRef,
      header,
      columns,
      pagination,
      filters,
      records,
      visibleColumns,
      selectColumns,
      selectVisibleColumns,
      items,
      changeDateEnd,
      changeFilter,
      clickCreate,
      filterFn,
      onRequest
    }
  },
}
</script>
