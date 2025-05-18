<template>
  <div class="modal" @click.self="emit('closeModal')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Update Complaint</h3>
      </div>
      <div class="modal-body">
        <form action="" @submit.prevent="submitForm">
          <div class="form-group-w-title">
            <h4>Complaint Details</h4>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="names">Complainant Name</label>
                <InputText id="names" v-model="props.complaintToEdit.names" disabled />
              </div>
              <div class="form-group-item">
                <label for="phone">Phone Number</label>
                <InputText id="phone" v-model="props.complaintToEdit.telephone" disabled />
              </div>
            </div>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="email">Email Address</label>
                <InputText id="email" v-model="props.complaintToEdit.email" disabled />
              </div>
              <div class="form-group-item">
                <label for="title">Complaint Title</label>
                <InputText id="title" v-model="props.complaintToEdit.title" disabled />
              </div>
            </div>
            <div class="form-group">
              <div class="form-group-item">
                <label for="description">Complaint Description</label>
                <Textarea id="description" v-model="props.complaintToEdit.description" rows="4" disabled />
              </div>
            </div>
          </div>

          <div class="form-group-w-title">
            <h4>Complaint Information</h4>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="trackingCode">Tracking Code</label>
                <InputText id="trackingCode" v-model="props.complaintToEdit.trackingCode" disabled />
              </div>
              <div class="form-group-item">
                <label for="status">Status <small title="This field is required">*</small></label>
                <Dropdown 
                  id="status" 
                  v-model="formPayload.status" 
                  :options="statusOptions" 
                  placeholder="Select status"
                  required
                />
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
                  @change="handleCategoryChange"
                />
              </div>
              <div class="form-group-item">
                <label for="agency">Assigned Agency</label>
                <InputText 
                  id="agency" 
                  v-model="selectedAgencyName" 
                  disabled 
                  placeholder="Agency will be assigned based on category"
                />
              </div>
            </div>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="response">Response</label>
                <Textarea 
                  id="response" 
                  v-model="formPayload.response" 
                  rows="4" 
                  placeholder="Enter your response to the complaint"
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
import { onMounted, PropType, ref, computed } from 'vue';
import { IGetComplaintResDto } from "@shared/interfaces/complaints/response/IComplaintRes.dto";
import { IGetCategoryResDto } from "@shared/interfaces/categories/response/ICategoryRes.dto";
import { useToast } from "primevue/usetoast";
import { ComplaintsActionTypes } from '@/stores/actions/action-types.enum';
import { CategoriesActionTypes } from '@/stores/actions/action-types.enum';
import axios from 'axios';
import { useComplaintsStore } from '@/stores/complaints';
import { useCategoriesStore } from '@/stores/categories';
import { EComplaintStatus } from '@shared/enums/EComplainStatus.enum';
import { IUpdateComplaintReq } from '@shared/interfaces/complaints/request/IComplaintReq.dto';

const emit = defineEmits(['closeModal', 'completed']);
const props = defineProps({
  complaintToEdit: {
    type: Object as PropType<IGetComplaintResDto>,
    required: true,
  }
});

const formPayload = ref({
  status: EComplaintStatus.PENDING,
  categoryId: null as number | null,
  response: '',
});

const categories = ref<IGetCategoryResDto[]>([]);
const selectedAgencyName = ref('');
const isLoading = ref(false);
const toast = useToast();
const complaintsStore = useComplaintsStore();
const categoriesStore = useCategoriesStore();

const statusOptions = Object.values(EComplaintStatus);

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

const handleCategoryChange = () => {
  const selectedCategory = categories.value.find(cat => cat.id === formPayload.value.categoryId);
  selectedAgencyName.value = selectedCategory?.agency?.name || 'No agency assigned';
};

const submitForm = async () => {
  if (!formPayload.value.status || !formPayload.value.categoryId) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Status and Category are required', life: 3000 });
    return;
  }

  isLoading.value = true;

  const selectedCategory = categories.value.find(cat => cat.id === formPayload.value.categoryId);
  
  const payload: IUpdateComplaintReq = {
    status: formPayload.value.status,
    responseText: formPayload.value.response,
    names: props.complaintToEdit!.names,
    title: props.complaintToEdit!.title,
    telephone: props.complaintToEdit!.telephone,
    email: props.complaintToEdit!.email,
    description: props.complaintToEdit!.description,
    categoryId: formPayload.value.categoryId,
  }

  try {
    await complaintsStore[ComplaintsActionTypes.UPDATE_COMPLAINT](props.complaintToEdit!.id!, payload);

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Complaint updated successfully',
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
          detail: error.response?.data.message || 'An error occurred while updating complaint',
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while updating complaint',
        life: 3000
      });
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await getCategories();
  if (props.complaintToEdit) {
    formPayload.value = {
      status: props.complaintToEdit.status,
      categoryId: props.complaintToEdit.category?.id || null,
      response: props.complaintToEdit.response?.response || '',
    };
    handleCategoryChange();
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

    :deep(.p-textarea) {
      width: 100%;
      font-size: .96rem;
    }
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style> 