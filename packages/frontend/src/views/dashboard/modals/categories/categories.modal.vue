<template>
  <div class="modal" @click.self="emit('closeModal')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ props.categoryToEdit ? 'Edit Category' : 'Add Category' }}</h3>
      </div>
      <div class="modal-body">
        <form action="" @submit.prevent="submitForm">
          <div class="form-group-w-title">
            <h4>Category Information</h4>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="name">Category Name <small title="This field is required">*</small></label>
                <InputText id="name" v-model="formPayload.name" required />
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
import { onMounted, PropType, ref } from 'vue';
import { IGetCategoryResDto } from "@shared/interfaces/categories/response/ICategoryRes.dto";
import { useToast } from "primevue/usetoast";
import { CategoriesActionTypes } from '@/stores/actions/action-types.enum';
import axios from 'axios';
import { useCategoriesStore } from '@/stores/categories';

const emit = defineEmits(['closeModal', 'completed']);
const props = defineProps({
  categoryToEdit: {
    type: Object as PropType<IGetCategoryResDto>,
    required: false,
  }
});

const formPayload = ref({
  name: '',
});

const isLoading = ref(false);
const toast = useToast();
const categoriesStore = useCategoriesStore();

const submitForm = async () => {
  if (!formPayload.value.name) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Category name is required', life: 3000 });
    return;
  }

  isLoading.value = true;

  try {
    if (props.categoryToEdit && props.categoryToEdit.id) {
      await categoriesStore[CategoriesActionTypes.UPDATE_CATEGORY](props.categoryToEdit.id, formPayload.value);
    } else {
      await categoriesStore[CategoriesActionTypes.CREATE_CATEGORY](formPayload.value);
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Category ${props.categoryToEdit ? 'updated' : 'created'} successfully`,
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
          detail: error.response?.data.message || `An error occurred while ${props.categoryToEdit ? 'updating' : 'creating'} category`,
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `An error occurred while ${props.categoryToEdit ? 'updating' : 'creating'} category`,
        life: 3000
      });
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (props.categoryToEdit) {
    formPayload.value = {
      name: props.categoryToEdit.name,
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
}
</style>
