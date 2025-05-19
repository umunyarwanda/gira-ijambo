<template>
  <section class="track-header section-wrapper">
    <div class="section-container">
      <h1 class="track-header__title">Ibisobanuro by'Ikibazo</h1>
      <p class="track-header__desc">
        Reba ibisobanuro birambuye by'ikibazo watanze, uko gihagaze n'aho kigeze gukemurwa.
      </p>
    </div>
  </section>
  <section class="complaint-detail section-wrapper">
    <div class="section-container">
      <div class="complaint-detail__card" v-if="!loading && complaintResponse">
        <div class="complaint-detail__header">
          <h2 class="complaint-detail__title">{{ complaintResponse.title }}</h2>
          <span :class="['complaint-detail__status', 'complaint-detail__status--' + complaintResponse.status.toLowerCase().replace(/ /g, '-') ]">
            {{ complaintResponse.status.split('_').join(' ') }}
          </span>
        </div>
        <div class="complaint-detail__meta">
          <div><strong>Amazina:</strong> {{ complaintResponse.names }}</div>
          <div><strong>Telefoni:</strong> {{ complaintResponse.telephone || 'N/A' }}</div>
          <div><strong>Email:</strong> {{ complaintResponse.email || 'N/A' }}</div>
        </div>
        <div class="complaint-detail__desc">
          <strong>Ikibazo:</strong>
          <p>{{ complaintResponse.description }}</p>
        </div>
        <div class="complaint-detail__desc response" v-if="complaintResponse.response">
          <strong>Igisubizo:</strong>
          <p>{{ complaintResponse.response.response }}</p>
        </div>
        <Message severity="info" :closable="false" v-else>
          <p>Nta gisubizo murahabwa</p>
        </Message>
        <div class="complaint-detail__info">
          <span><strong>Byanditswe Tariki: </strong>{{ dayjs(complaintResponse.createdAt).format('DD/MM/YYYY HH:mm') }}</span>
          <span><strong>Ikibazo cyashyikirijwe: </strong> {{ complaintResponse.agency?.name || 'N/A' }}</span>
          <span><strong>Ikiciro: </strong> {{ complaintResponse.category?.name || 'N/A' }}</span>
          <span v-if="complaintResponse.response"><strong>Mwasubijwe Tariki: </strong>{{ dayjs(complaintResponse.response?.createdAt).format('DD/MM/YYYY HH:mm') || 'N/A' }}</span>
        </div>

        <div class="complaint-detail__actions">
          <router-link :to="{ name: 'site-complaints' }" class="complaint-detail__actions-button">
            <ion-icon name="arrow-back-outline"></ion-icon>
            <span>Subira inyuma</span>
          </router-link>
        </div>
      </div>
      <div class="complaint-detail__loading" v-if="loading">
        <ProgressSpinner stroke-width="5" style="width: 50px; height: 50px; fill: red; stroke: red;" />
        <p>Tegereza akanya gato...</p>
      </div>
      <div class="complaint-detail__error" v-if="!loading && !complaintResponse">
        <div class="complaint-detail__error-icon">
          <ion-icon name="alert-circle-outline"></ion-icon>
        </div>
        <h3 class="complaint-detail__error-title">Ikibazo Ntibonetse</h3>
        <p class="complaint-detail__error-desc">
          Ikibazo cyawe nticyabonetse. Reba ko wakoresheje nomero y'ikiranga y'ikibazo cyawe cyangwa ongera ugerageze.
        </p>
        <button @click="getComplaint" class="complaint-detail__error-button">
          Ongera ugerageze
          <ion-icon name="refresh-outline"></ion-icon>
        </button>

        <router-link :to="{ name: 'site-complaints' }" class="complaint-detail__error-link">
          <ion-icon name="arrow-back-outline"></ion-icon>
          <span>Shyiramo indi kode</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ComplaintsActionTypes } from '@/stores/actions/action-types.enum';
import { useComplaintsStore } from '@/stores/complaints';
import { IGetComplaintResDto } from '@shared/interfaces/complaints/response/IComplaintRes.dto';
import { useHead } from '@unhead/vue';
import dayjs from 'dayjs';
import { Message, ProgressSpinner, useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const loading = ref(true);
const complaintResponse = ref<IGetComplaintResDto | null>(null);

const complaintStore = useComplaintsStore();
const route = useRoute();
const toast = useToast();

useHead({
  title: 'Ibisobanuro by\'Ikibazo'
})


const getComplaint = async () => {
  loading.value = true;
  try {
    const token = route.params.token as string;
    const response = await complaintStore[ComplaintsActionTypes.GET_COMPLAINT](token);
    complaintResponse.value = response.data.data;
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

onMounted(() => {
  getComplaint();
});
</script>

<style scoped lang="scss">
.complaint-detail {
  width: 100%;
  background: #fff;
  padding: 20px 15px;
  &__card {
    background: #edf1f4af;
    border-radius: 1.2rem;
    padding: 30px 20px;
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2rem;
    gap: 10px;
    flex-wrap: wrap;

    @media (max-width: 500px) {
      flex-direction: column-reverse;
      align-items: flex-start;
    }
  }
  &__title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #101820;
    margin: 0;
    flex: 1;
    text-align: left;

    @media (max-width: 700px) {
      font-size: 1.1rem;
    }
  }
  &__status {
    font-size: 0.96rem;
    font-weight: 700;
    padding: 5px 13px;
    border-radius: 10px;
    &--pending {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #88763e;
    }
    &--resolved, &--closed {
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
  &__meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1.5rem;
    font-size: 1rem;
    color: #222;
    strong {
      font-weight: 700;
      color: #101820;
    }
  }
  &__desc {
    font-size: 1.08rem;
    color: #222;
    background: #fff;
    border-radius: 0.7rem;
    padding: 1rem 1.2rem;
    margin: 0.5rem 0;
    box-shadow: 0 1px 6px 0 #eaf3fa;
    p {
      margin: 0;
      line-height: 1.6;
      font-size: .97rem;
    }
    strong {
      display: flex;
      font-size: .99rem;
      margin-bottom: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }

    &.response {
      background: #dce1e4;
    }
  }
  &__info {
    display: flex;
    align-items: center;
    column-gap: 2rem;
    row-gap: 1rem;
    font-size: .97rem;
    color: #555;
    flex-wrap: wrap;

    strong {
      font-weight: 700;
      color: #101820;
    }
    ion-icon {
      font-size: 1.1rem;
      margin-right: 0.3rem;
      vertical-align: middle;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 1rem;
    
    &-button {
      display: flex;
      align-items: center;
      margin: 0 auto;
      gap: 0.5rem;
      background: var(--blue);
      color: #fff;
      border: none;
      border-radius: 2rem;
      padding: 10px 30px;
      font-size: .98rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      ion-icon {
        right: 0;
        position: relative;
        transition: all 0.2s;
      }

      &:hover {
        background: var(--blue-dark);

        ion-icon {
          right: 0.5rem;
        }
      }
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    p {
      font-size: 1.3rem;
      font-weight: 700;
      color: #101820;
      margin-top: 1rem;
    }
  }

  &__error {
    background: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 1.2rem;
    padding: 2.5rem;
    text-align: center;
    margin: 0 auto;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  &__error-icon {
    width: 70px;
    height: 70px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.8rem;
    color: #856404;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 8px rgba(133, 100, 4, 0.1);
  }

  &__error-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #856404;
    margin: 0;
  }

  &__error-desc {
    font-size: 1rem;
    color: #856404;
    margin: 0;
    line-height: 1.5;
  }

  &__error-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #fff;
    color: #856404;
    border: 1px solid #856404;
    border-radius: 2rem;
    padding: 10px 30px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
    text-decoration: none;

    &:hover {
      background: #856404;
      color: #fff;
    }

    ion-icon {
      font-size: 1.3rem;
    }
  }

  &__error-link {
    text-decoration: none;
    color: var(--blue);
    font-size: 1rem;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;

    span {
      font-weight: 700;
    }

    &:hover {
      color: var(--blue-dark);
      text-decoration: underline;
    }
    
    ion-icon {
      font-size: 1.3rem;
    }
  }
}
</style>
