<template>
  <section class="track-header section-wrapper">
    <div class="section-container">
      <h1 class="track-header__title">Gutanga Ikibazo Cyawe</h1>
      <p class="track-header__desc">
        Koresha fomu (form) ugeze ikibazo cyangwa igitekerezo cyawe kuri Leta, uhabwe kode igufasha gukurikirana aho ikibazo cyawe kigeze gikemurwa.
      </p>
    </div>
  </section>
  <section v-if="showConfirmation" class="confirmation">
    <div class="confirmation__card">
      <div class="confirmation__icon">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
      </div>
      <h2 class="confirmation__title">Ikibazo cyawe cyoherejwe!</h2>
      <p class="confirmation__desc">
        Murakoze gutanga ikibazo cyanyu.<br>
        Uzajya ukurikirana aho ikibazo cyawe kigeze ukoresheje kode y'ihariye ikurikira.
      </p>
      <div>

        <div class="confirmation__code-block">
          <span class="confirmation__code-label">Kode y'ihariye</span>
          <div class="confirmation__code-block-inner">
            <span class="confirmation__code" @click="copyCode">{{ submittedCode }}</span>
            <button class="confirmation__code-copy" @click="copyCode">
              <ion-icon :name="isCodeCopied ? 'checkmark-outline' : 'copy-outline'"></ion-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="confirmation__actions">
        <router-link class="confirmation__btn confirmation__btn--home" :to="{ name: 'home' }">Subira Ahabanza</router-link>
        <router-link class="confirmation__btn confirmation__btn--track" :to="{ name: 'complaint', params: { token: submittedCode } }">Kurikiranira Hano</router-link>
      </div>
    </div>
  </section>
  <section v-else class="submit-form-section section-wrapper">
    <div class="section-container">
      <form class="submit-form" @submit.prevent="submitComplaint">
        <div class="submit-form__row">
          <div class="submit-form__field">
            <label for="name">Amazina yawe</label>
            <InputText id="name" required v-model="form.names" placeholder="Andika amazina yawe yose" />
          </div>
          <div class="submit-form__field">
            <label for="category">Ikiciro cy'ikibazo</label>
            <Select 
              id="category" 
              v-model="form.categoryId" 
              :options="categories" 
              optionLabel="name" 
              optionValue="id" 
              placeholder="Hitamo ikiciro" 
              :loading="isLoadingCategories" 
              :required="true"
              filter
            />
          </div>
        </div>
        <div class="submit-form__row">
          <div class="submit-form__field">
            <label for="email">Imeyili</label>
            <InputText id="email" v-model="form.email" type="email" placeholder="imeyili@urugero.com" />
          </div>
          <div class="submit-form__field">
            <label for="title">Inyito y'ikibazo</label>
            <InputText id="title" v-model="form.title" placeholder="Tanga inyito ngufi y'ikibazo cyawe" />
          </div>
        </div>
        <div class="submit-form__row">
          <div class="submit-form__field">
            <label for="phone">Telefoni</label>
            <InputMask 
              id="phone" 
              v-model="form.telephone"
              mask="+250 999 999 999" 
              placeholder="+250 7xx xxx xxx" 
            />
          </div>
        </div>
        <div class="submit-form__row">
          <div class="submit-form__field submit-form__field--full">
            <label for="description">Ibisobanuro by'ikibazo</label>
            <Textarea id="description" v-model="form.description" rows="4" autoResize placeholder="Andika hano ibisobanuro birambuye by'ikibazo cyawe..." />
          </div>
        </div>
        <div class="submit-form__actions">
          <Button type="submit" label="Ohereza Ikibazo" icon="pi pi-arrow-right" iconPos="right" :loading="isLoadingSubmit" />
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { Button, InputMask, Message, Select } from 'primevue';
import { ICreateComplaintReq } from '@shared/interfaces/complaints/request/IComplaintReq.dto';
import { useCategoriesStore } from '@/stores/categories';
import { IGetCategoryResDto } from '@shared/interfaces/categories/response/ICategoryRes.dto';
import { CategoriesActionTypes } from '@/stores/actions/action-types.enum';
import { useToast } from 'primevue/usetoast';
import { useComplaintsStore } from '@/stores/complaints';
import { ComplaintsActionTypes } from '@/stores/actions/action-types.enum';
import { IGetComplaintResDto } from '@shared/interfaces/complaints/response/IComplaintRes.dto'
import { useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';

const toast = useToast();
const router = useRouter();

useHead({
  title: 'Ohereza Ikibazo'
})

const telephone = ref<number | null>(null);
const form = ref<ICreateComplaintReq>({
  names: '',
  email: null,
  telephone: '',
  title: '',
  description: '',
  categoryId: null,
});

// Load saved user info from localStorage
const loadSavedUserInfo = () => {
  const savedInfo = localStorage.getItem('userInfo');
  if (savedInfo) {
    const { names, email, telephone } = JSON.parse(savedInfo);
    form.value.names = names || '';
    form.value.email = email || null;
    form.value.telephone = telephone || '';
  }
};

// Save user info to localStorage
const saveUserInfo = () => {
  const userInfo = {
    names: form.value.names,
    email: form.value.email,
    telephone: form.value.telephone
  };
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

const categoriesStore = useCategoriesStore();
const complaintsStore = useComplaintsStore();
const categories = ref<IGetCategoryResDto[]>([]);
const isLoadingCategories = ref(false);
const isLoadingSubmit = ref(false);
const showConfirmation = ref(false);
const submittedCode = ref('');
const isCodeCopied = ref(false);

const copyCode = () => {
  navigator.clipboard.writeText(submittedCode.value);
  isCodeCopied.value = true;
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Ukopiye kode y\'ikibazo cyawe / Code copied to clipboard',
    life: 3000,
  });

  setTimeout(() => {
    isCodeCopied.value = false;
  }, 3000);
}

const getCategories = async () => {
  isLoadingCategories.value = true;
  try {
    const response = await categoriesStore[CategoriesActionTypes.GET_CATEGORIES]();
    const { data } = response.data as { data: IGetCategoryResDto[] };
    categories.value = data;
  } catch (error: any) {
    if (error.response?.data.message && Array.isArray(error.response?.data.message)) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data.message[0],
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while fetching categories',
        life: 3000,
      });
    }
  } finally {
    isLoadingCategories.value = false;
  }
}

const submitComplaint = async () => {
  if (form.value.categoryId === 0) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: "Hitamo ikiciro cy'ikibazo cywe",
      life: 3000,
    });
  }
  isLoadingSubmit.value = true;
  try {
    const response = await complaintsStore[ComplaintsActionTypes.CREATE_COMPLAINT](form.value);
    const { data } = response.data as { data: IGetComplaintResDto };
    submittedCode.value = data.trackingCode;
    showConfirmation.value = true;
    complaintsStore.SAVE_COMPLAINT(data.trackingCode);
    
    // Save user info after successful submission
    saveUserInfo();
    
  } catch (error: any) {
    if (error.response?.data.message && Array.isArray(error.response?.data.message)) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data.message[0],
        life: 3000,
      });
    } else {
      console.log(error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data.message ? error.response?.data.message : 'An error occurred while submitting complaint',
        life: 3000,
      });
    }
  } finally {
    isLoadingSubmit.value = false;
  }
}

onMounted(() => {
  getCategories();
  loadSavedUserInfo();
});
</script>

<style scoped lang="scss">
.submit-form-section {
  width: 100%;
  background: #fff;
  padding: 20px 15px;
  display: flex;
  justify-content: center;
}
.submit-form {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 0 130px -10px rgba(0, 0, 0, 0.122);
  padding: 40px 30px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  border: 1px solid #c4cad1;

  @media (max-width: 700px) {
    padding: 30px 20px;
  }
}
.submit-form__row {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 0.7rem;
  }
}
.submit-form__field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label {
    font-weight: 700;
    color: #222;
    font-size: .98rem;
    margin-bottom: 0.2rem;
  }
  :deep(input),
  :deep(select),
  :deep(textarea),
  :deep(.p-inputtext),
  :deep(.p-dropdown),
  :deep(.p-dropdown-label),
  :deep(.p-dropdown-trigger),
  :deep(.p-inputtextarea) {
    padding: 8px 16px;
    border-radius: 0.7rem;
    border: 1.5px solid #e2e8f0;
    font-size: .95rem;
    outline: none;
    background: #f9fafb;
    transition: border 0.2s;
    width: 100%;
    box-sizing: border-box;
    &:focus {
      border-color: var(--blue);
      background: #fff;
    }
  }
  textarea,
  :deep(.p-inputtextarea) {
    min-height: 120px;
    resize: vertical;
  }
  &--full {
    flex: 2;
  }
}
.submit-form__actions {
  display: flex;
  justify-content: center;
  margin-top: 1.2rem;
  :deep(.p-button), .submit-form__submit {
    margin-top: 0;
    background: var(--blue);
    color: #fff;
    border: none;
    border-radius: 2rem;
    padding: 10px 30px;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 2px 12px 0 #eaf3fa;
    transition: background 0.2s;
    &:hover {
      background: var(--blue-dark);
    }
  
    ion-icon {
      margin-left: 0.5rem;
    }
  }
}

.confirmation {
  width: 100%;
  min-height: 60vh;
  padding: 30px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6fafd;

  &__card {
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 8px 40px 0 #eaf3fa;
    padding: 2.5rem 2rem;
    max-width: 620px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.5s;
  }

  &__icon {
    font-size: 4rem;
    color: var(--blue, #2563eb);
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--blue-dark, #1e40af);
    margin-bottom: 0.7rem;
    text-align: center;
  }

  &__desc {
    color: #444;
    font-size: 1rem;
    text-align: center;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  &__code-block {
    background: #f1f5fb;
    border-radius: 0.7rem;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    width: 100%;
  }

  &__code-label {
    display: block;
    color: #777676;
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    font-weight: 600;
  }

  &__code {
    font-family: 'Fira Mono', 'Consolas', monospace;
    font-size: 1.5rem;
    font-weight: 700;
    color: #222;
    background: #c8ced4;
    border-radius: 0.4rem;
    padding: 0.2rem 0.7rem;
    letter-spacing: 0.05em;
    display: inline-block;
    user-select: all;
  }

  &__code-block-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      margin: 0;
      outline: none;
      color: var(--blue);
      font-size: 1.2rem;
      transition: color 0.2s;
      &:hover {
        color: var(--blue);
      }
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__btn {
    padding: 10px 15px;
    border-radius: 2rem;
    font-size: 1rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 12px 0 #eaf3fa;

    &--home {
      background: #fff;
      color: var(--blue-dark, #1e40af);
      border: 2px solid var(--blue, #2563eb);
      &:hover {
        background: var(--blue, #2563eb);
        color: #fff;
      }
    }
    &--track {
      background: var(--blue, #2563eb);
      color: #fff;
      &:hover {
        background: var(--blue-dark, #1e40af);
      }
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>
