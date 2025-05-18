<template>
  <div class="modal" @click.self="emit('closeModal')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ props.userToEdit ? 'Edit User' : 'Add User' }}</h3>
      </div>
      <div class="modal-body">
        <form action="" @submit.prevent="submitForm">
          <div class="form-group-w-title">
            <h4>User Information</h4>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="firstName">First Name <small title="This field is required">*</small></label>
                <InputText id="firstName" v-model="formPayload.firstName" required />
              </div>
              <div class="form-group-item">
                <label for="lastName">Last Name <small title="This field is required">*</small></label>
                <InputText id="lastName" v-model="formPayload.lastName" required />
              </div>
            </div>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="email">Email <small title="This field is required">*</small></label>
                <InputText id="email" v-model="formPayload.email" type="email" required />
              </div>
              <div class="form-group-item">
                <label for="phone">Phone <small title="This field is required">*</small></label>
                <InputText id="phone" v-model="formPayload.phone" required />
              </div>
            </div>
            <div class="form-group flexed">
              <div class="form-group-item">
                <label for="role">Role <small title="This field is required">*</small></label>
                <Dropdown
                  id="role"
                  v-model="formPayload.role"
                  :options="roleOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select a role"
                  required
                />
              </div>
            </div>
            <div class="form-group flexed" v-if="!props.userToEdit">
              <div class="form-group-item">
                <label for="password">Password <small title="This field is required">*</small></label>
                <Password
                  id="password"
                  v-model="formPayload.password"
                  :feedback="false"
                  toggleMask
                  required
                />
              </div>
              <div class="form-group-item">
                <label for="confirmPassword">Confirm Password <small title="This field is required">*</small></label>
                <Password
                  id="confirmPassword"
                  v-model="formPayload.confirmPassword"
                  :feedback="false"
                  toggleMask
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
import Dropdown from 'primevue/dropdown';
import Password from 'primevue/password';
import { onMounted, PropType, ref } from 'vue';
import { IGetUserResDto } from "@shared/interfaces/users/response/IGetUserResDto";
import { useToast } from "primevue/usetoast";
import { UsersActionTypes } from '@/stores/actions/action-types.enum';
import axios from 'axios';
import { useUsersStore } from '@/stores/users';
import { EUserRole } from '@shared/enums/EUserRole.enum';
import { ICreateUserReqDto } from '@shared/interfaces/users/request/IUserReqDto';

const emit = defineEmits(['closeModal', 'completed']);
const props = defineProps({
  userToEdit: {
    type: Object as PropType<IGetUserResDto>,
    required: false,
  }
});

const formPayload = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: undefined as EUserRole | undefined,
  password: '',
  confirmPassword: '',
});

const roleOptions = [
  { label: 'Super Admin', value: EUserRole.SUPER_ADMIN },
  { label: 'Agency Admin', value: EUserRole.AGENCY_ADMIN },
];

const isLoading = ref(false);
const toast = useToast();
const usersStore = useUsersStore();

const submitForm = async () => {
  if (!formPayload.value?.firstName || !formPayload.value?.lastName || 
      !formPayload.value?.email || !formPayload.value?.phone || 
      !formPayload.value?.role) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'All fields are required', life: 3000 });
    return;
  }

  if (!props.userToEdit && (!formPayload.value?.password || !formPayload.value?.confirmPassword)) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Password and confirm password are required', life: 3000 });
    return;
  }

  if (!props.userToEdit && formPayload.value?.password !== formPayload.value?.confirmPassword) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match', life: 3000 });
    return;
  }

  isLoading.value = true;

  try {
    if (props.userToEdit && props.userToEdit.id) {
      const payload: ICreateUserReqDto = {
        firstName: formPayload.value.firstName,
        lastName: formPayload.value.lastName,
        email: formPayload.value.email,
        phone: formPayload.value.phone,
        role: formPayload.value.role!,
        password: formPayload.value.password,
        confirmPassword: formPayload.value.confirmPassword,
      };
      await usersStore[UsersActionTypes.UPDATE_USER](props.userToEdit.id, payload);
    } else {
      const payload: ICreateUserReqDto = {
        firstName: formPayload.value.firstName,
        lastName: formPayload.value.lastName,
        email: formPayload.value.email,
        phone: formPayload.value.phone,
        role: formPayload.value.role!,
        password: formPayload.value.password,
        confirmPassword: formPayload.value.confirmPassword,
      };
      await usersStore[UsersActionTypes.CREATE_USER](payload);
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `User ${props.userToEdit ? 'updated' : 'created'} successfully`,
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
          detail: error.response?.data.message || `An error occurred while ${props.userToEdit ? 'updating' : 'creating'} user`,
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `An error occurred while ${props.userToEdit ? 'updating' : 'creating'} user`,
        life: 3000
      });
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (props.userToEdit) {
    formPayload.value = {
      firstName: props.userToEdit.firstName,
      lastName: props.userToEdit.lastName,
      email: props.userToEdit.email,
      phone: props.userToEdit.phone,
      role: props.userToEdit.role,
      password: '',
      confirmPassword: '',
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