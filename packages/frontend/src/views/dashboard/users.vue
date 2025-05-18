<template>
  <div class="crd table-crd">
    <DataTable v-model:filters="filters" :value="users" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="id" filterDisplay="menu"
      :loading="isLoading" :globalFilterFields="globalFilterFields" removableSort ref="dataTableRef">

      <template #header>
        <div class="flex justify-between table-filters-headers">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <div class="table-filters-headers-actions">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search users" />
            </IconField>
            <Button 
              type="button" 
              icon="pi pi-plus" 
              label="Add User" 
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

      <template #empty> No users found. </template>
      <template #loading> Loading users data. Please wait. </template>

      <Column field="names" header="Full Name" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetUserResDto }">
          {{ data.firstName + ' ' + data.lastName || 'N/A' }}
        </template>
      </Column>

      <Column field="email" header="Email" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetUserResDto }">
          {{ data.email || 'N/A' }}
        </template>
      </Column>

      <!-- <Column field="telephone" header="Telephone" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetUserResDto }">
          {{ data.telephone || 'N/A' }}
        </template>
      </Column> -->

      <Column field="role" header="Role" style="min-width: 10rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetUserResDto }">
          <Tag :value="data.role" :severity="getRoleSeverity(data.role)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="roleOptions" placeholder="Select Role" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column>

      <!-- <Column field="agency.name" header="Agency" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetUserResDto }">
          {{ data.agency?.name || 'N/A' }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="agencyOptions" placeholder="Select Agency" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column> -->

      <Column field="createdAt" header="Created" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetUserResDto }">
          {{ data.createdAt ? dayjs(data.createdAt).format('DD/MM/YYYY HH:mm') : 'N/A' }}
        </template>
      </Column>

      <Column field="actions" header="Actions" style="min-width: 10rem">
        <template #body="{ data }: { data: IGetUserResDto }">
          <Button type="button" icon="pi pi-pencil" @click="showModal = true; userToEdit = data" text rounded severity="warning" />
          &nbsp;
          <Button @click="confirmDeleteUser($event, data.id)" type="button" icon="pi pi-trash" text rounded severity="danger" />
        </template>
      </Column>
    </DataTable>
  </div>

  <Transition name="modal">
    <UsersModal 
      v-if="showModal" 
      @closeModal="showModal = false; userToEdit = undefined" 
      @completed="showModal = false; getUsers(); userToEdit = undefined" 
      :userToEdit="userToEdit"
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
import { useUsersStore } from '@/stores/users';
import { UsersActionTypes } from '@/stores/actions/action-types.enum';
import { IGetUserResDto } from "@shared/interfaces/users/response/IGetUserResDto";
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Select from 'primevue/select';
import UsersModal from './modals/users/users.modal.vue';
import dayjs from 'dayjs';
import { EUserRole } from '@shared/enums/EUserRole.enum';

const users = ref<IGetUserResDto[]>([]);
const userToEdit = ref<IGetUserResDto | undefined>(undefined);
const isLoading = ref(false);
const showModal = ref(false);
const globalFilterFields: (keyof IGetUserResDto)[] = ['firstName', 'lastName', 'email', 'phone'];
const filters = ref();
const authStore = useAuthStore();
const toast = useToast();
const confirm = useConfirm();
const dataTableRef = ref();

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    role: { value: null, matchMode: 'equals' },
    'agency.name': { value: null, matchMode: 'contains' }
  };
};

const roleOptions = computed(() => {
  return Object.values(EUserRole);
});

// const agencyOptions = computed(() => {
//   return [...new Set(users.value.map(user => user.agency?.name || 'N/A'))];
// });

const getRoleSeverity = (role: EUserRole) => {
  switch (role) {
    case EUserRole.SUPER_ADMIN:
      return 'success';
    case EUserRole.AGENCY_ADMIN:
      return 'info';
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

const getUsers = async () => {
  isLoading.value = true;
  try {
    const response = await useUsersStore()[UsersActionTypes.GET_USERS]();
    const { data } = response.data as { data: IGetUserResDto[] };
    users.value = data;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while fetching users',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

const deleteUser = async (id: number) => {
  try {
    const response = await useUsersStore()[UsersActionTypes.DELETE_USER](id);
    const { data } = response.data as { data: IGetUserResDto };
    users.value = users.value.filter(user => user.id !== id);
    toast.add({
      severity: 'success', 
      summary: 'Success',
      detail: 'User deleted successfully',
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error', 
      detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while deleting user',
      life: 3000,
    });
  }
}

const confirmDeleteUser = async (event: Event, id: number) => {
  confirm.require({
    target: event.target as HTMLElement,
    message: 'Do you want to delete this user?',
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
      deleteUser(id);
    },
  });
}

onMounted(() => {
  getUsers();
});

useHead({
  title: 'Users'
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
