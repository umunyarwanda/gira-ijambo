<template>
  <div class="crd table-crd">
    <DataTable v-model:filters="filters" :value="categories" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="id" filterDisplay="menu"
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
              label="Add Category" 
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

      <template #empty> No categories found. </template>
      <template #loading> Loading categories data. Please wait. </template>

      <Column field="name" header="Category Name" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetCategoryResDto }">
          {{ data.name || 'N/A' }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="categoryOptions" placeholder="Select Category" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column>

      <Column field="agency.name" header="Agency Name" style="min-width: 12rem" :showFilterMatchModes="false">
        <template #body="{ data }: { data: IGetCategoryResDto }">
          {{ data.agency?.name || 'N/A' }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="agencyOptions" placeholder="Select Agency" style="min-width: 12rem" :showClear="true" />
        </template>
      </Column>

      <Column field="createdAt" header="Submitted" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetCategoryResDto }">
          {{ data.createdAt ? dayjs(data.createdAt).format('DD/MM/YYYY HH:mm') : 'N/A' }}
        </template>
      </Column>

      <Column field="complainCount" header="Complain Count" :sortable="true" style="min-width: 12rem">
        <template #body="{ data }: { data: IGetCategoryResDtoWithcomplainCount }">
          {{ data.complainCount || 0 }}
        </template>
      </Column>

      <Column field="actions" header="Actions" style="min-width: 10rem">
        <template #body="{ data }: { data: IGetCategoryResDto }">
          <Button type="button" icon="pi pi-pencil" @click="showModal = true; categoryToEdit = data" text rounded severity="warning" />
          &nbsp;
          <Button @click="confirmDeleteCategory($event, data.id)" type="button" icon="pi pi-trash" text rounded severity="danger" />
        </template>
      </Column>
    </DataTable>
  </div>

  <Transition name="modal">
    <CategoriesModal 
      v-if="showModal" 
      @closeModal="showModal = false; categoryToEdit = undefined" 
      @completed="showModal = false; getCategories(); categoryToEdit = undefined" 
      :categoryToEdit="categoryToEdit"
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
import { useCategoriesStore } from '@/stores/categories';
import { CategoriesActionTypes } from '@/stores/actions/action-types.enum';
import { IGetCategoryResDto, IGetCategoryResDtoWithcomplainCount } from "@shared/interfaces/categories/response/ICategoryRes.dto";
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Select from 'primevue/select';
import CategoriesModal from './modals/categories/categories.modal.vue';
import dayjs from 'dayjs';

const categories = ref<IGetCategoryResDto[]>([]);
const categoryToEdit = ref<IGetCategoryResDto | undefined>(undefined);
const isLoading = ref(false);
const showModal = ref(false);
const globalFilterFields: (keyof IGetCategoryResDto)[] = ['name', 'agency'];
const filters = ref();
const authStore = useAuthStore();
const toast = useToast();
const confirm = useConfirm();
const dataTableRef = ref();

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    'agency.name': { value: null, matchMode: 'contains' }
  };
};

const categoryOptions = computed(() => {
  return [...new Set(categories.value.map(category => category.name || 'N/A'))];
});

const agencyOptions = computed(() => {
  return [...new Set(categories.value.map(category => category.agency?.name || 'N/A'))];
});

initFilters();

const clearFilter = () => {
  initFilters();
};

const exportCSV = (event: Event) => {
  dataTableRef.value.exportCSV(event);
}

const getCategories = async () => {
  isLoading.value = true;
  try {
    const response = await useCategoriesStore()[CategoriesActionTypes.GET_CATEGORIES_WITH_COMPLAIN_COUNT]();
    const { data } = response.data as { data: IGetCategoryResDtoWithcomplainCount[] };
    categories.value = data;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while fetching categories',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

const deleteCategory = async (id: number) => {
  try {
    const response = await useCategoriesStore()[CategoriesActionTypes.DELETE_CATEGORY](id);
    const { data } = response.data as { data: IGetCategoryResDto };
    categories.value = categories.value.filter(category => category.id !== id);
    toast.add({
      severity: 'success', 
      summary: 'Success',
      detail: 'Category deleted successfully',
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error', 
      detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while deleting category',
      life: 3000,
    });
  }
}

const confirmDeleteCategory = async (event: Event, id: number) => {
  confirm.require({
    target: event.target as HTMLElement,
    message: 'Do you want to delete this category?',
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
      deleteCategory(id);
    },
  });
}

onMounted(() => {
  getCategories();
});

useHead({
  title: 'Categories'
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