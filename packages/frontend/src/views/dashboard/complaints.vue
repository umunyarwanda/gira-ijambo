<template>
  <div class="crd table-crd">
    <DataTable v-model:filters="filters" :value="complaints" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="trackingCode" filterDisplay="menu"
      :loading="isLoading" :globalFilterFields="globalFilterFields" removableSort ref="dataTableRef">

      <template #header>
        <div class="flex justify-between table-filters-headers">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <div class="table-filters-headers-actions">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search by tracking code" />
            </IconField>
            <Button 
              icon="pi pi-external-link" 
              label="Export" 
              @click="exportCSV($event)" 
            />
          </div>
        </div>
      </template>

      <template #empty> No complaints found. </template>
      <template #loading> Loading complaints data. Please wait. </template>

      <Column field="trackingCode" header="Tracking Code" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          {{ data.trackingCode || 'N/A' }}
        </template>
      </Column>

      <Column field="names" header="Names" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          {{ data.names || 'N/A' }}
        </template>
      </Column>

      <Column field="title" header="Title" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          {{ data.title || 'N/A' }}
        </template>
      </Column>

      <Column field="telephone" header="Telephone" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          {{ data.telephone || 'N/A' }}
        </template>
      </Column>

      <Column field="email" header="Email" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          {{ data.email || 'N/A' }}
        </template>
      </Column>

      <Column field="category.name" header="Category" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          {{ data.category?.name || 'N/A' }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="categoryOptions" placeholder="Select Category" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column>

      <Column field="agency.name" header="Agency" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          {{ data.agency?.name || 'N/A' }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="agencyOptions" placeholder="Select Agency" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column>

      <Column field="status" header="Status" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="statusOptions" placeholder="Select Status" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column>

      <Column field="response" header="Response" style="min-width: 10rem">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          <Tag 
            :value="data.response ? 'Answered' : 'Not Answered'" 
            :severity="data.response ? 'success' : 'warning'"
          />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select 
            v-model="filterModel.value" 
            @change="filterCallback()" 
            :options="responseOptions" 
            placeholder="Select Response Status" 
            style="min-width: 12rem" 
            :showClear="true" 
          />
        </template>
      </Column>

      <Column field="createdAt" header="Submitted" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          {{ data.createdAt ? dayjs(data.createdAt).format('DD/MM/YYYY HH:mm') : 'N/A' }}
        </template>
      </Column>

      <Column field="actions" header="Actions" style="min-width: 10rem">
        <template #body="{ data }: { data: IGetComplaintResDto }">
          <Button type="button" icon="pi pi-pencil" @click="showModal = true; complaintToEdit = data" text rounded severity="warning" />
        </template>
      </Column>
    </DataTable>
  </div>

  <Transition name="modal">
    <ComplaintsModal 
      v-if="showModal && complaintToEdit" 
      @closeModal="showModal = false; complaintToEdit = null" 
      @completed="showModal = false; getComplaints(); complaintToEdit = null" 
      :complaintToEdit="complaintToEdit"
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
import Tag from 'primevue/tag';
import { useAuthStore } from '@/stores/auth';
import { useComplaintsStore } from '@/stores/complaints';
import { ComplaintsActionTypes } from '@/stores/actions/action-types.enum';
import { IGetComplaintResDto } from "@shared/interfaces/complaints/response/IComplaintRes.dto";
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Select from 'primevue/select';
import ComplaintsModal from './modals/complaints/complaints.modal.vue';
import dayjs from 'dayjs';
import { EComplaintStatus } from '@shared/enums/EComplainStatus.enum';

const complaints = ref<IGetComplaintResDto[]>([]);
const complaintToEdit = ref<IGetComplaintResDto | null>(null);
const isLoading = ref(false);
const showModal = ref(false);
const globalFilterFields: (keyof IGetComplaintResDto)[] = ['trackingCode', 'names', 'title', 'email', 'telephone'];
const filters = ref();
const authStore = useAuthStore();
const toast = useToast();
const confirm = useConfirm();
const dataTableRef = ref();

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    'category.name': { value: null, matchMode: 'contains' },
    'agency.name': { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    response: { value: null, matchMode: 'equals' }
  };
};

const categoryOptions = computed(() => {
  return [...new Set(complaints.value.map(complaint => complaint.category?.name || 'N/A'))];
});

const agencyOptions = computed(() => {
  return [...new Set(complaints.value.map(complaint => complaint.agency?.name || 'N/A'))];
});

const statusOptions = computed(() => {
  return Object.values(EComplaintStatus);
});

const responseOptions = computed(() => {
  return ['Answered', 'Not Answered'];
});

const getStatusSeverity = (status: EComplaintStatus) => {
  switch (status) {
    case EComplaintStatus.PENDING:
      return 'info';
    case EComplaintStatus.IN_PROGRESS:
      return 'info';
    case EComplaintStatus.RESOLVED:
      return 'success';
    case EComplaintStatus.CLOSED:
      return 'danger';
    default:
      return 'info';
  }
};

initFilters();

const clearFilter = () => {
  initFilters();
};

const exportCSV = (event: Event) => {
  dataTableRef.value.exportCSV(event);
}

const getComplaints = async () => {
  isLoading.value = true;
  try {
    const response = await useComplaintsStore()[ComplaintsActionTypes.GET_COMPLAINTS]();
    const { data } = response.data as { data: IGetComplaintResDto[] };
    complaints.value = data;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while fetching complaints',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getComplaints();
});

useHead({
  title: 'Complaints'
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
