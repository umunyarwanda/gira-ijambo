<template>
  <div class="crd table-crd">
    <DataTable v-model:filters="filters" :value="agencies" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="id" filterDisplay="menu"
      :loading="isLoading" :globalFilterFields="globalFilterFields" removableSort ref="dataTableRef">

      <template #header>
        <div class="flex justify-between table-filters-headers">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <div class="table-filters-headers-actions">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </IconField>
            <Button 
              type="button" 
              icon="pi pi-plus" 
              label="Add Agency" 
              outlined 
              @click="showModal = true" 
            />
            <Button 
              icon="pi pi-external-link" 
              label="Export" 
              @click="exportCSV($event)" 
            />
          </div>
        </div>
      </template>

      <template #empty> No agencies found. </template>
      <template #loading> Loading agencies data. Please wait. </template>

      <Column field="name" header="Agency Name" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetAgencyResDto }">
          {{ data.name || 'N/A' }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="agencyOptions" placeholder="Select Agency" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column>

      <Column field="description" header="Description" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetAgencyResDto }">
          {{ data.description || 'N/A' }}
        </template>
      </Column>

      <Column field="email" header="Email" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetAgencyResDto }">
          {{ data.email || 'N/A' }}
        </template>
      </Column>

      <Column field="category.name" header="Category" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetAgencyResDto }">
          {{ data.category?.name || 'N/A' }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="categoryOptions" placeholder="Select Category" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column>

      <Column field="createdAt" header="Submitted" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetAgencyResDto }">
          {{ data.createdAt ? dayjs(data.createdAt).format('DD/MM/YYYY HH:mm') : 'N/A' }}
        </template>
      </Column>

      <Column field="actions" header="Actions" style="min-width: 10rem">
        <template #body="{ data }: { data: IGetAgencyResDto }">
          <Button type="button" icon="pi pi-pencil" @click="showModal = true; agencyToEdit = data" text rounded severity="warning" />
          &nbsp;
          <Button @click="confirmDeleteAgency($event, data.id)" type="button" icon="pi pi-trash" text rounded severity="danger" />
        </template>
      </Column>
    </DataTable>
  </div>

  <Transition name="modal">
    <AgenciesModal 
      v-if="showModal" 
      @closeModal="showModal = false; agencyToEdit = undefined" 
      @completed="showModal = false; getAgencies(); agencyToEdit = undefined" 
      :agencyToEdit="agencyToEdit"
    />
  </Transition>  
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { onMounted, ref, computed } from 'vue';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useAuthStore } from '@/stores/auth';
import { useAgenciesStore } from '@/stores/agencies';
import { AgenciesActionTypes } from '@/stores/actions/action-types.enum';
import { IGetAgencyResDto } from "@shared/interfaces/agencies/response/IAgencyRes.dto";
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Select from 'primevue/select';
import AgenciesModal from './modals/agencies/agencies.modal.vue';
import dayjs from 'dayjs';

const agencies = ref<IGetAgencyResDto[]>([]);
const agencyToEdit = ref<IGetAgencyResDto | undefined>(undefined);
const isLoading = ref(false);
const showModal = ref(false);
const globalFilterFields: (keyof IGetAgencyResDto)[] = ['name', 'description', 'email', 'category'];
const filters = ref();
const authStore = useAuthStore();
const toast = useToast();
const confirm = useConfirm();
const dataTableRef = ref();

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    'category.name': { value: null, matchMode: 'contains' }
  };
};

const agencyOptions = computed(() => {
  return [...new Set(agencies.value.map(agency => agency.name || 'N/A'))];
});

const categoryOptions = computed(() => {
  return [...new Set(agencies.value.map(agency => agency.category?.name || 'N/A'))];
});

initFilters();

const clearFilter = () => {
  initFilters();
};

const exportCSV = (event: Event) => {
  dataTableRef.value.exportCSV(event);
}

const getAgencies = async () => {
  isLoading.value = true;
  try {
    const response = await useAgenciesStore()[AgenciesActionTypes.GET_AGENCIES]();
    const { data } = response.data as { data: IGetAgencyResDto[] };
    agencies.value = data;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while fetching agencies',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

const deleteAgency = async (id: number) => {
  try {
    const response = await useAgenciesStore()[AgenciesActionTypes.DELETE_AGENCY](id);
    const { data } = response.data as { data: IGetAgencyResDto };
    agencies.value = agencies.value.filter(agency => agency.id !== id);
    toast.add({
      severity: 'success', 
      summary: 'Success',
      detail: 'Agency deleted successfully',
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error', 
      detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while deleting agency',
      life: 3000,
    });
  }
}

const confirmDeleteAgency = async (event: Event, id: number) => {
  confirm.require({
    target: event.target as HTMLElement,
    message: 'Do you want to delete this agency?',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      deleteAgency(id);
    },
  });
}

onMounted(() => {
  getAgencies();
});

useHead({
  title: 'Agencies'
});
</script>

<style lang="scss" scoped>
.table-crd {
  padding: 1rem;
}

.table-filters-headers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  &-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
}
</style>
