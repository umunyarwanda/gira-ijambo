<template>
  <section class="track-header section-wrapper">
    <div class="section-container">
      <h1 class="track-header__title">Kurikirana Ibibazo Watanze</h1>
      <p class="track-header__desc">
        Injiza kode iranga ikibazo cyawe kugira ngo ukurikirane ibisubizo byatanzwe n'inzego za Leta.
      </p>
    </div>
  </section>
  <section class="complaints section-wrapper">
    <div class="section-container">
      <form class="complaints__search" @submit.prevent="getComplaint">
        <InputText v-model="search" :disabled="loading" required placeholder="Shakisha ukoresheje kode, urugero: 3c3d1814..." />
        <ProgressSpinner v-if="loading" style="width: 30px; height: 30px; margin-right: 0.5rem;" stroke-width="5" />
        <button type="submit" v-else>Shakisha <ion-icon name="search-outline"></ion-icon></button>
      </form>

      <h2 class="complaints__title">Bikora gute</h2>
      <div class="how-it-works">
        <div class="how-it-works__steps">
          <div class="how-it-works__step">
            <div class="how-it-works__circle">
              <ion-icon name="search-outline"></ion-icon>
              <span class="how-it-works__badge">1</span>
            </div>
            <p class="how-it-works__step-desc">Shyiramo kode iranga ikibazo cyawe</p>
          </div>
          <div class="how-it-works__step">
            <div class="how-it-works__circle">
              <ion-icon name="time-outline"></ion-icon>
              <span class="how-it-works__badge">2</span>
            </div>
            <p class="how-it-works__step-desc">Reba aho ikibazo cyawe kigeze n'ibisubizo byatanzwe</p>
          </div>
          <div class="how-it-works__step">
            <div class="how-it-works__circle">
              <ion-icon name="notifications-outline"></ion-icon>
              <span class="how-it-works__badge">3</span>
            </div>
            <p class="how-it-works__step-desc">Ubone ibisubizo byatanzwe n'inzego za Leta</p>
          </div>
        </div>
      </div>

      <template v-if="myComplaints.length > 0">
        <h2 class="complaints__title">Ibibazo mperuka kubaza</h2>
        <div class="complaints__list">
          <router-link :to="{ name: 'complaint', params: { token: complaint.trackingCode } }" v-for="complaint in myComplaints" :key="complaint.id" class="complaint-card">
            <div class="complaint-card__header">
              <h3 class="complaint-card__title">{{ complaint.title }}</h3>
              <span :class="['complaint-card__status', 'complaint-card__status--' + complaint.status.toLowerCase()]">
                {{ complaint.status.split('_').join(' ') }}
              </span>
            </div>
            <p class="complaint-card__desc line-clamp-2">{{ complaint.description }}</p>
            <div class="complaint-card__meta">
              <div class="complaint-card__meta-items">
                <span><ion-icon name="calendar-outline"></ion-icon> {{ dayjs(complaint.createdAt).format('DD/MM/YYYY') }}</span>
                <span><ion-icon name="business-outline"></ion-icon> {{ complaint.agency ? complaint.agency.name : 'N/A' }}</span>
              </div>
  
              <router-link :to="{ name: 'complaint', params: { token: complaint.trackingCode } }" class="complaint-card__link">
                Reba ikibazo
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </router-link>
            </div>
          </router-link>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import { ProgressSpinner } from 'primevue';
import { useComplaintsStore } from '@/stores/complaints';
import { ComplaintsActionTypes } from '@/stores/actions/action-types.enum';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { IGetComplaintResDto } from '@shared/interfaces/complaints/response/IComplaintRes.dto';
import dayjs from 'dayjs';
import { useHead } from '@unhead/vue';

const complaintStore = useComplaintsStore();
const router = useRouter();
const toast = useToast();
const search = ref<string>('');
const myComplaints = ref<IGetComplaintResDto[]>([]);
const loading = ref(false);

useHead({
  title: 'Kurikirana Ikibazo'
})

const getComplaint = async () => {
  if (!search.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Shyiramo kode y\'ikibazo cyawe',
      life: 3000
    });
    return;
  };
  loading.value = true;
  try {
    const response = await complaintStore[ComplaintsActionTypes.GET_COMPLAINT](search.value);
    
    const complaint = response.data.data as IGetComplaintResDto;
    if (complaint) {
      router.push({ name: 'complaint', params: { token: complaint.trackingCode } });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Kode y\'ikibazo cyawe ntibashije kuboneka, Ongera ugerageze',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const getLocalComplaints = async () => {
  const complaints = localStorage.getItem(complaintStore.localComplaintKey);
  if (complaints) {
    const complaintsArray = JSON.parse(complaints);

    if (Array.isArray(complaintsArray) && complaintsArray.length > 0 && complaintsArray.every(complaint => typeof complaint === 'string')) {
      try {
        const bulkComplaints = await complaintStore[ComplaintsActionTypes.GET_BULK_COMPLAINTS](complaintsArray);
        myComplaints.value = bulkComplaints.data.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
}


onMounted(() => {
  getLocalComplaints();
})

</script>

<style scoped lang="scss">
.complaints {
  width: 100%;
  background: #fff;
  padding: 2rem 0 2rem 0;
  &__search {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 2rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    border: 1.5px solid var(--blue);
    border-radius: 10px;
    overflow: hidden;

    @media (max-width: 720px) {
      max-width: 90%;
    }
    input {
      flex: 1;
      padding: 0.7rem 1.2rem;
      border-radius: 2rem;
      font-size: .97rem;
      box-shadow: none;
      border: none;
      outline: none;
      transition: border 0.2s;
      &:focus {
        border-color: var(--blue-dark);
      }
    }
    button {
      background: var(--blue);
      color: #fff;
      border: none;
      padding: 0.7rem 1.2rem;
      font-size: .97rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
      &:hover {
        background: var(--blue-dark);
      }

      ion-icon {
        font-size: 1.1rem;
        margin-left: 0.3rem;
        vertical-align: middle;
      }
    }
  }
  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 0 auto;
    padding: 0 20px;

    @media (max-width: 850px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  &__title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #101820;
    margin: 0;
    text-align: center;
    margin-bottom: 1rem;
  }
}
.complaint-card {
  background: #edf1f4a3;
  border-radius: 1.2rem;
  padding: 1.5rem 1.5rem 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  transform: scale(1);
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: #dce1e4;
    transform: scale(1.01);

    .complaint-card__link {
      background: var(--blue-dark);
      color: white;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2rem;
  }
  &__title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #101820;
    margin: 0;
    flex: 1;
    text-align: left;

    @media (max-width: 700px) {
      font-size: .98rem;
    }
  }
  &__status {
    font-size: 0.85rem;
    font-weight: 700;
    padding: 5px 13px;
    border-radius: 10px;
    &--pending {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #88763e;
    }
    &--resolved {
      background: #d4edda;
      color: #155724;
      border: 1px solid #155724;
    }
    &--in_progress {
      background: #cce5ff;
      color: #004085;
      border: 1px solid #004085;
    }
  }
  &__desc {
    font-size: .96rem;
    color: #222;
  }
  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    font-size: 0.95rem;
    color: #555;
    flex-wrap: wrap;
    &-items {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    a {
      padding: 5px 23px;
      background: #a7a6a646;
      border-radius: 50px;
      font-size: .9rem;
      transition: background 0.2s;
    }

    ion-icon {
      font-size: 1.1rem;
      margin-right: 0.3rem;
      vertical-align: middle;
    }
  }
}

.how-it-works {
  width: 100%;
  padding: 2rem 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__steps {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 3rem;
    flex-wrap: wrap;
    width: 100%;
    margin: 0 auto;
  }
  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 250px;
    margin-bottom: 2rem;
  }
  &__circle {
    background: linear-gradient(45deg, var(--blue-dark), var(--blue-light));
    color: #fff;
    width: 75px;
    height: 75px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.3rem;
    position: relative;
    margin-bottom: 1.1rem;
    box-shadow: 0 0 30px 0 #eaf3fa;
  }
  &__badge {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #fff;
    color: var(--blue);
    border: 2px solid var(--blue);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 700;
    box-shadow: 0 2px 8px #eaf3fa;
  }
  &__step-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #101820;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  &__step-desc {
    font-size: 1rem;
    color: #444;
    text-align: center;
    font-weight: 400;
    margin-bottom: 0.2rem;
  }
}

@media (max-width: 900px) {
  .how-it-works__steps {
    gap: 2rem;
  }
  .how-it-works__step {
    width: 200px;
  }
}

@media (max-width: 600px) {
  .how-it-works__steps {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  .how-it-works__step {
    width: 100%;
    max-width: 300px;
  }
}
</style>
