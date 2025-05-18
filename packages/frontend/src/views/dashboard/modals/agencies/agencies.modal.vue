<template>
  <div class="modal" @click.self="emit('closeModal')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ props.agencyToEdit ? 'Edit Agency' : 'Add Agency' }}</h3>
      </div>
      <div class="modal-body">
        <form action="" @submit.prevent="submitForm">
          <div class="form-group-w-title">
            <h4>Agency Information</h4>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="name">Agency Name <small title="This field is required">*</small></label>
                <InputText id="name" v-model="formPayload.name" required />
              </div>
              <div class="form-group-item">
                <label for="email">Email</label>
                <InputText id="email" v-model="formPayload.email" type="email" />
              </div>
            </div>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="description">Description</label>
                <Textarea id="description" v-model="formPayload.description" rows="3" />
              </div>
            </div>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="category">Category <small title="This field is required">*</small></label>
                <Dropdown 
                  id="category" 
                  v-model="formPayload.categoryId" 
                  :options="categories" 
                  optionLabel="name" 
                  optionValue="id"
                  placeholder="Select a category"
                  required
                />
              </div>
            </div>
          </div>
          <div class="button-group">
            <Button type="submit" :loading="isLoading" :disabled="isLoading" label="Save" />
            <Button type="button" :disabled="isLoading" label="Close" @click="emit('closeModal')" severity="secondary" />
          </div>
        </form>
      </div>
    </div>
    <span class="modal-close material-symbols-outlined" @click="emit('closeModal')">close</span>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import { onMounted, PropType, ref } from 'vue';
import { IGetAgencyResDto } from "@shared/interfaces/agencies/response/IAgencyRes.dto";
import { IGetCategoryResDto } from "@shared/interfaces/categories/response/ICategoryRes.dto";
import { useToast } from "primevue/usetoast";
import { AgenciesActionTypes } from '@/stores/actions/action-types.enum';
import { CategoriesActionTypes } from '@/stores/actions/action-types.enum';
import axios from 'axios';
import { useAgenciesStore } from '@/stores/agencies';
import { useCategoriesStore } from '@/stores/categories';
import { ICreateAgencyReqDto, IUpdateAgencyReqDto } from '@shared/interfaces/agencies/request/IAgencyReq.dto';

const emit = defineEmits(['closeModal', 'completed']);
const props = defineProps({
  agencyToEdit: {
    type: Object as PropType<IGetAgencyResDto>,
    required: false,
  }
});

const formPayload = ref({
  name: '',
  description: '',
  email: '',
  categoryId: null as number | null,
});

const categories = ref<IGetCategoryResDto[]>([]);
const isLoading = ref(false);
const toast = useToast();
const agenciesStore = useAgenciesStore();
const categoriesStore = useCategoriesStore();

const getCategories = async () => {
  try {
    const response = await categoriesStore[CategoriesActionTypes.GET_CATEGORIES]();
    const { data } = response.data as { data: IGetCategoryResDto[] };
    categories.value = data;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load categories',
      life: 3000
    });
  }
};

const submitForm = async () => {
  if (!formPayload.value.name || !formPayload.value.categoryId) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Name and Category are required', life: 3000 });
    return;
  }

  isLoading.value = true;

  try {
    if (props.agencyToEdit && props.agencyToEdit.id) {
      await agenciesStore[AgenciesActionTypes.UPDATE_AGENCY](props.agencyToEdit.id, formPayload.value as IUpdateAgencyReqDto);
    } else {
      await agenciesStore[AgenciesActionTypes.CREATE_AGENCY](formPayload.value as ICreateAgencyReqDto);
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Agency ${props.agencyToEdit ? 'updated' : 'created'} successfully`,
      life: 3000
    });
    emit('completed');
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (Array.isArray(error.response?.data.message)) {
        error.response?.data.message.forEach((message: string) => {
          toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data.message || `An error occurred while ${props.agencyToEdit ? 'updating' : 'creating'} agency`,
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `An error occurred while ${props.agencyToEdit ? 'updating' : 'creating'} agency`,
        life: 3000
      });
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await getCategories();
  if (props.agencyToEdit) {
    formPayload.value = {
      name: props.agencyToEdit.name,
      description: props.agencyToEdit.description || '',
      email: props.agencyToEdit.email || '',
      categoryId: props.agencyToEdit.category?.id || null,
    };
  }
});
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    margin-bottom: 1.5rem;
    
    h3 {
      margin: 0;
      color: var(--primary-color);
    }
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    color: white;
    font-size: 1.5rem;
  }
}

.form-group-w-title {
  margin-bottom: 1.5rem;

  h4 {
    margin: 1rem 0;
    color: var(--primary-color);
  }
}

.form-group {
  &.flexed {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .form-group-item {
    flex: 1;
    min-width: 200px;

    label {
      display: block;
      margin-bottom: 0.5rem;
      
      small {
        color: red;
      }
    }
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}
</style> 