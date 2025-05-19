<template>
  <section class="hero section-wrapper">
    <div class="section-container">
      <div class="hero__content">
        <h1 class="hero__title">
          Gira Ijambo, geza ikibazo cyawe kuri Leta, gikemurwe mu buryo bworoshye
        </h1>
        <p class="hero__subtitle">
          <b>Gira Ijambo</b>, umuyoboro wizewe wo kugeza igitekerezo n’ikibazo cyawe kuri Leta, ndetse no gukurikirana ikibazo cyawe kugeza gikemuwe, mu buryo bworoshye
        </p>
        <div class="hero__actions">
          <form class="hero__actions-form" @submit.prevent="getComplaint">
            <div class="hero__actions-form-input-container">
              <InputText
                v-model="code"
                class="hero__actions-form-input"
                type="text"
                placeholder="Shyiramo kode y'ikibazo cyawe."
                :disabled="loading"
              />
            </div>
            <button class="hero__track" type="submit" v-if="!loading">
              Kurikirana ikibazo
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
            <div class="hero__actions-button-loading" v-else>
              <ProgressSpinner style="width: 30px; height: 30px; margin-right: 10px;"  />
            </div>
          </form>
          <div class="hero__actions-button">
            <span>Cyangwa</span>
            <router-link :to="{ name: 'submit-complaint' }" class="hero__cta">
              Ohereza Ikibazo Gishya
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- How it Works Section -->
  <section class="how-it-works section-wrapper">
    <div class="section-container">
      <div class="how-it-works__header">
        <ion-icon name="help-outline" class="how-it-works__icon"></ion-icon>
        <h2 class="how-it-works__title section-title">Bikorwa gute?</h2>
        <div class="how-it-works__divider"></div>
      </div>
      <div class="how-it-works__steps">
        <div class="how-it-works__step" v-for="(step, index) in steps" :key="index">
          <div class="how-it-works__circle">
            <ion-icon :name="step.icon"></ion-icon>
            <span class="how-it-works__badge">{{ index + 1 }}</span>
          </div>
          <h3 class="how-it-works__step-title">{{ step.title }}</h3>
          <p class="how-it-works__step-desc">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
  <!-- Quick Actions Section -->
  <section class="actions-cards section-wrapper">
    <div class="section-container">
      <div class="actions-cards__header">
        <ion-icon name="flash-outline" class="actions-cards__header-icon"></ion-icon>
        <h2 class="section-title">Biroroshye, nawe wabyikorera</h2>
        <div class="actions-cards__header-divider"></div>
      </div>
      <div class="actions-cards__container">
        <div class="actions-cards__card actions-cards__card--ask">
          <div class="actions-cards__icon-wrap">
            <ion-icon name="paper-plane-outline"></ion-icon>
          </div>
          <h3 class="actions-cards__title">Urifuza Gutanga Ikibazo Cyawe ?</h3>
          <p class="actions-cards__desc">
            Ohereza igitekerezo cyangwa ikibazo cyawe kuri serivisi za Leta ukoresheje uru rubuga, hanyuma ubone kode iranga ikibazo, niyo wifashisha kugira ngo ukurikirane aho ikibazo cyawe kigeze gikemurwa.
          </p>
          <ul class="actions-cards__features">
            <li><ion-icon name="add-circle-outline"></ion-icon> Tanga ikibazo cyangwa igitekerezo</li>
            <li><ion-icon name="send-outline"></ion-icon> Uhabwe kode iranga ikibazo cyawe</li>
            <li><ion-icon name="checkmark-done-outline"></ion-icon> Kurikirana aho ikibazo cyawe kigeze gikemurwa</li>
          </ul>
          <router-link :to="{name: 'submit-complaint'}" class="actions-cards__button actions-cards__button--primary">
            Kanda hano utange ikibazo gishya <ion-icon name="paper-plane-outline"></ion-icon>
          </router-link>
        </div>
        <div class="actions-cards__card actions-cards__card--track">
          <div class="actions-cards__icon-wrap actions-cards__icon-wrap--blue">
            <ion-icon name="clipboard-outline"></ion-icon>
          </div>
          <h3 class="actions-cards__title">Urifuza Gukurikirana Ikibazo Cyawe ?</h3>
          <p class="actions-cards__desc">
            Waba waratanze ikibazo? Injiza kode iranga ikibazo cyawe kugira ngo urebe aho kigeze gikemurwa ndetse n'ibisubizo byatanzwe n'inzego za Leta.
          </p>
          <ul class="actions-cards__features">
            <li><ion-icon name="search-outline"></ion-icon> Shakisha ikibazo cyawe ukoresheje kode y'ihariye</li>
            <li><ion-icon name="time-outline"></ion-icon> Kurikirana aho igisubizo kigeze</li>
            <li><ion-icon name="notifications-outline"></ion-icon> Ubone ibisubizo byatanzwe n'inzego za Leta</li>
          </ul>
          <router-link :to="{name: 'site-complaints'}" class="actions-cards__button actions-cards__button--outline">
            Kanda hano ukurikirane ikibazo cyawe watanze <ion-icon name="search-outline"></ion-icon>
          </router-link>
        </div>
      </div>
    </div>
  </section>
  <!-- Stats Section -->
  <section class="stats section-wrapper">
    <div class="section-container">
      <div class="stats__header">
        <ion-icon name="stats-chart-outline" class="stats__icon"></ion-icon>
        <h2 class="stats__title section-title">Imibare</h2>
        <div class="stats__divider"></div>
      </div>
      <div class="stats__cards">
        <div class="stats__card stats__card--purple">
          <div class="stats__card-icon">
            <ion-icon name="bar-chart-outline"></ion-icon>
          </div>
          <div class="stats__card-value">1,234</div>
          <div class="stats__card-title">Ibirego Byose</div>
          <div class="stats__card-desc">Ibirego byatanzwe ku rubuga</div>
        </div>
        <div class="stats__card stats__card--green">
          <div class="stats__card-icon">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </div>
          <div class="stats__card-value">1,087</div>
          <div class="stats__card-title">Ibyakemutse</div>
          <div class="stats__card-desc">Ibirego byakemuwe na Leta</div>
        </div>
        <div class="stats__card stats__card--orange">
          <div class="stats__card-icon">
            <ion-icon name="time-outline"></ion-icon>
          </div>
          <div class="stats__card-value">72h</div>
          <div class="stats__card-title">Igihe cyo Gusubiza</div>
          <div class="stats__card-desc">Impuzandengo y'igihe cyo gusubiza</div>
        </div>
        <div class="stats__card stats__card--purple">
          <div class="stats__card-icon">
            <ion-icon name="bar-chart-outline"></ion-icon>
          </div>
          <div class="stats__card-value">1,234</div>
          <div class="stats__card-title">Ibirego Byose</div>
          <div class="stats__card-desc">Ibirego byatanzwe ku rubuga</div>
        </div>
      </div>
    </div>
  </section>
  <!-- Government Institutions Section -->
  <section class="gov-institutions section-wrapper">
    <div class="section-container">
      <div class="gov-institutions__header">
        <ion-icon name="business-outline" class="gov-institutions__icon"></ion-icon>
        <h2 class="gov-institutions__title">Inzego za Leta Dukorana Nazo</h2>
        <div class="gov-institutions__divider"></div>
      </div>
      <div class="gov-institutions__cards">
        <div class="gov-institutions__card">
          <div class="gov-institutions__circle gov-institutions__circle--icon">
            <ion-icon name="business-outline"></ion-icon>
          </div>
          <div class="gov-institutions__card-title">Minisiteri y'Ubutegetsi bw'Igihugu</div>
          <div class="gov-institutions__card-desc">Ishinzwe guhuza ibikorwa by'ubutegetsi bw'igihugu</div>
          <a class="gov-institutions__card-link" href="https://www.minecofin.gov.rw/" target="_blank" rel="noopener">
            Reba urubuga rwabo <ion-icon name="open-outline"></ion-icon>
          </a>
        </div>
        <div class="gov-institutions__card">
          <div class="gov-institutions__circle gov-institutions__circle--icon">
            <ion-icon name="business-outline"></ion-icon>
          </div>
          <div class="gov-institutions__card-title">Minisiteri y'Ubuzima</div>
          <div class="gov-institutions__card-desc">Ishinzwe kubungabunga ubuzima bw'abanyarwanda</div>
          <a class="gov-institutions__card-link" href="https://www.moh.gov.rw/" target="_blank" rel="noopener">
            Reba urubuga rwabo <ion-icon name="open-outline"></ion-icon>
          </a>
        </div>
        <div class="gov-institutions__card">
          <div class="gov-institutions__circle gov-institutions__circle--icon">
            <ion-icon name="business-outline"></ion-icon>
          </div>
          <div class="gov-institutions__card-title">Ikigo cy'Igihugu Gishinzwe Iterambere</div>
          <div class="gov-institutions__card-desc">Gishinzwe iterambere ry'ubukungu mu Rwanda</div>
          <a class="gov-institutions__card-link" href="https://rdb.rw/" target="_blank" rel="noopener">
            Reba urubuga rwabo <ion-icon name="open-outline"></ion-icon>
          </a>
        </div>
        <div class="gov-institutions__card">
          <div class="gov-institutions__circle gov-institutions__circle--icon">
            <ion-icon name="business-outline"></ion-icon>
          </div>
          <div class="gov-institutions__card-title">Ikigo cy'Igihugu Gishinzwe Iterambere</div>
          <div class="gov-institutions__card-desc">Gishinzwe iterambere ry'ubukungu mu Rwanda</div>
          <a class="gov-institutions__card-link" href="https://rdb.rw/" target="_blank" rel="noopener">
            Reba urubuga rwabo <ion-icon name="open-outline"></ion-icon>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ComplaintsActionTypes } from '@/stores/actions/action-types.enum';
import { useComplaintsStore } from '@/stores/complaints';
import { IGetComplaintResDto } from '@shared/interfaces/complaints/response/IComplaintRes.dto';
import { useHead } from '@unhead/vue';
import { InputText, Message, MessageClasses, ProgressSpinner, useToast } from 'primevue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const code = ref('');
const toast = useToast();
const loading = ref(false);
const complaintStore = useComplaintsStore();
const router = useRouter();

useHead({
  title: 'Ahabanza'
})
const steps = ref([
  {
    icon: 'chatbubble-ellipses-outline',
    title: 'Ohereza Ikibazo',
    description: 'Ohereza ikibazo cyangwa igitekerezo ukoresheje urubuga'
  },
  {
    icon: 'send-outline',
    title: 'Kwemezwa',
    description: 'Turakira ubusabe bwawe mu buryo bw’ikoranabuhanga.'
  },
  {
    icon: 'clipboard-outline',
    title: 'Gukurikirana',
    description: 'Reba aho ikibazo cyawe kigeze ukoresheje nomero y’ikiranga'
  },
  {
    icon: 'notifications-outline',
    title: 'Kubona Inyandiko',
    description: 'Soma igisubizo cyatanzwe n’urwego rubishinzwe'
  },
  {
    icon: 'checkmark-done-circle-outline',
    title: 'Gukemura',
    description: 'Ikibazo cyawe kirakemuwe kandi tukakumenyesha'
  }
])

const getComplaint = async () => {
  if (!code.value) {
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
    const response = await complaintStore[ComplaintsActionTypes.GET_COMPLAINT](code.value);
    
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
</script>

<style scoped lang="scss">
@use '@/assets/scss/_variables.scss' as *;

.hero {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;

  @media (max-width: 780px) {
    min-height: unset;
    padding: 170px 0 70px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
  }

  &__title {
    font-size: 2.4rem;
    font-weight: 800;
    width: 60%;
    color: var(--blue);
    margin-bottom: 1.2rem;
    line-height: 1.2;

    @media (max-width: 946px) {
      width: 80%;
      font-size: 2rem;
    }

    @media (max-width: 600px) {
      width: 90%;
      font-size: 1.8rem;
    }

    @media (max-width: 550px) {
      width: 95%;
      font-size: 1.4rem;
    }
  }

  &__subtitle {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 30px;
    font-weight: 500;
    max-width: 600px;

    @media (max-width: 946px) {
      width: 80%;
      font-size: 1rem;
    }

    @media (max-width: 600px) {
      width: 90%;
      font-size: 1rem;
    }
    
    b {
      font-weight: 900;
    }
  }

  &__actions {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    @media (max-width: 550px) {
      width: 90%;
    }
    
    &-form {
      display: flex;
      align-items: center;
      width: 100%;
      border: 1.5px solid var(--blue);
      border-radius: 2rem;
      box-shadow: 0 0 100px -10px rgba(0, 0, 0, 0.362);
      background: var(--white);
      padding: 5px;
      justify-content: center;
      position: relative;

      @media (max-width: 550px) {
        flex-direction: column;
        gap: 10px;
        background: transparent;
        box-shadow: none;
        border: none;
      }
  
      &-input-container {
        position: relative;
        width: 100%;
      }
      
      &-input {
        flex: 1;
        padding: 0.7rem 1.2rem;
        border-radius: 2rem;
        font-size: .96rem;
        border: none;
        box-shadow: none;
        background: transparent;
        outline: none;
        transition: border 0.2s;
        min-width: 270px;

        @media (max-width: 550px) {
          min-width: unset;
          width: 100%;
          border: 1px solid var(--blue);
          background: var(--white);
          box-shadow: 0 0 100px -10px rgba(0, 0, 0, 0.362);
        }
        &:focus {
          border-color: var(--blue-dark);
        }
      }
      button {
        background: var(--blue);
        color: #fff;
        border: none;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.7rem 1.5rem;
        font-size: .96rem;
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
        transition: background 0.2s;
        &:hover {
          background: var(--blue-dark);

          ion-icon {
            left: 0.5rem;
          }
        }

        ion-icon {
          font-size: 1.2rem;
          position: relative;
          left: 0;
          transition: left 0.2s;
          margin-left: 0.3rem;
        }
      }
    }

    &-button {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      margin-top: 20px;

      @media (max-width: 550px) {
        flex-direction: column;
        gap: 10px;
      }

      span {
        font-size: 1rem;
        font-weight: 600;
        color: var(--blue);
        opacity: .8;
      }
      button, a {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        background: var(--blue-dark);
        color: #fff;
        border: none;
        border-radius: 2rem;
        padding: 12px 29px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: var(--shadow-primary);
        transition: background 0.2s, box-shadow 0.2s;

        ion-icon {
          font-size: 1.2rem;
          position: relative;
          left: 0;
          transition: left 0.2s;
        }

        &:hover {
          background: var(--blue);
          box-shadow: var(--shadow-secondary);

          ion-icon {
            left: 0.5rem;
          }
        }
      }
    }
  }
}


.how-it-works {
  width: 100%;
  background: #fafbfc;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  &__icon {
    font-size: 2.5rem;
    color: var(--white);
    background: linear-gradient(45deg, var(--blue-light), var(--blue));
    border-radius: 50%;
    padding: 0.7rem;
    margin-bottom: 0.7rem;
  }
  &__divider {
    width: 70px;
    height: 5px;
    background: #cbe3f7;
    border-radius: 2px;
    margin: 0 auto 0.5rem auto;
  }
  &__steps {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
    margin: 0 auto;
  }
  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 210px;
    margin-bottom: 20px;
  }
  &__circle {
    background: linear-gradient(45deg, var(--blue-dark), var(--blue-light));
    color: #fff;
    width: 85px;
    height: 85px;
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

.stats {
  width: 100%;
  background: #f7fafc;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  &__icon {
    font-size: 2.5rem;
    color: var(--blue);
    background: #eaf3fa;
    border-radius: 50%;
    padding: 0.7rem;
    margin-bottom: 0.7rem;
  }
  &__divider {
    width: 70px;
    height: 5px;
    background: #cbe3f7;
    border-radius: 2px;
    margin: 0 auto 0.5rem auto;
  }
  &__cards {
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
    margin: 0 auto;
  }

  &__card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 40px 0 #eaf3fa;
    padding: 2.5rem 2.2rem 2rem 2.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: box-shadow 0.2s;
    position: relative;
    text-align: center;
    &:hover {
      box-shadow: 0 12px 50px 0 #dbeafe;
    }
  }
  &__card-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    margin-bottom: 1.1rem;
    background: #f3f4fa;
  }
  &__card--purple &__card-icon {
    background: linear-gradient(45deg, #7b2ff2, #f357a8);
    color: #fff;
  }
  &__card--green &__card-icon {
    background: linear-gradient(45deg, #00c97b, #00e6a2);
    color: #fff;
  }
  &__card--orange &__card-icon {
    background: linear-gradient(45deg, #ff8800, #ffb347);
    color: #fff;
  }
  &__card-value {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #7b2ff2, #f357a8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  &__card--green &__card-value {
    background: linear-gradient(45deg, #00c97b, #00e6a2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  &__card--orange &__card-value {
    background: linear-gradient(45deg, #ff8800, #ffb347);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  &__card-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #101820;
    margin-bottom: 0.3rem;
  }
  &__card-desc {
    font-size: 1rem;
    color: #444;
    font-weight: 400;
  }
}

.actions-cards {
  width: 100%;
  background: transparent;
  padding: 30px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  &__header-icon {
    font-size: 2.5rem;
    color: var(--blue);
    background: #eaf3fa;
    border-radius: 50%;
    padding: 0.7rem;
    margin-bottom: 0.7rem;
  }
  &__header-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #101820;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  &__header-divider {
    width: 70px;
    height: 5px;
    background: #cbe3f7;
    border-radius: 2px;
    margin: 0 auto 0.5rem auto;
  }
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;
    align-items: stretch;
    gap: 2.5rem;
    flex-wrap: wrap;
    width: 100%;
    max-width: 1100px;
    padding: 0 20px;
    margin: 0 auto;

    @media (max-width: 600px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  &__card {
    background: rgba(255,255,255,0.85);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
    border-radius: 2rem;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // flex: 1 1 350px;
    position: relative;
    text-align: center;
    backdrop-filter: blur(4px);
    border: 1.5px solid #eaf3fa;
    transition: box-shadow 0.2s, transform 0.2s;
    width: 100%;
    &:hover {
      box-shadow: 0 16px 48px 0 #eaf3fa;
      transform: translateY(-4px) scale(1.02);
    }
  }
  &__icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #eaf3fa 60%, var(--blue-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.3rem;
    margin-bottom: 1.1rem;
    color: var(--blue-dark);
    box-shadow: 0 2px 12px 0 #eaf3fa;
    &--blue {
      background: linear-gradient(135deg, #eaf3fa 60%, var(--blue) 100%);
      color: var(--blue);
    }
  }
  &__title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #101820;
    margin-bottom: 0.7rem;
    text-align: center;
  }
  &__desc {
    font-size: .96rem;
    color: #222;
    margin-bottom: 1.2rem;
    font-weight: 500;
    line-height: 1.5;
  }
  &__features {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
    width: 100%;
    li {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: .97rem;
      color: #1a365d;
      margin-bottom: 0.5rem;
      font-weight: 500;
      ion-icon {
        font-size: 1.2rem;
        color: var(--blue);
      }
    }
  }
  &__button {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    border-radius: 1.5rem;
    font-size: 1rem;
    font-weight: 700;
    padding: 10px 30px;
    cursor: pointer;
    border: none;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    &--primary {
      background: var(--blue);
      color: #fff;
      box-shadow: 0 2px 12px 0 #eaf3fa;
      &:hover {
        background: var(--blue-dark);
      }
    }
    &--outline {
      background: #fff;
      color: var(--blue-dark);
      border: 2px solid var(--blue);
      &:hover {
        background: var(--blue-light);
        color: #fff;
      }
    }
    ion-icon {
      font-size: 1.3rem;
    }
  }
}
// @media (max-width: 900px) {
//   .actions-cards__container {
//     gap: 1.2rem;
//   }
//   .actions-cards__card {
//     min-width: 220px;
//     padding: 1.5rem 1rem 1.2rem 1rem;
//   }
// }
// @media (max-width: 600px) {
//   .actions-cards__container {
//     flex-direction: column;
//     align-items: center;
//     gap: 1.5rem;
//   }
//   .actions-cards__card {
//     width: 100%;
//     max-width: 400px;
//   }
// }

.gov-institutions {
  width: 100%;
  background: #fafbfc;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  &__icon {
    font-size: 2.5rem;
    color: var(--blue);
    background: #eaf3fa;
    border-radius: 50%;
    padding: 0.7rem;
    margin-bottom: 0.7rem;
  }
  &__title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #101820;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  &__divider {
    width: 70px;
    height: 5px;
    background: #cbe3f7;
    border-radius: 2px;
    margin: 0 auto 0.5rem auto;
  }
  &__cards {
    display: flex;
    // grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    align-items: stretch;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
    margin: 0 auto;
  }
  &__card {
    border-radius: 20px;
    padding: 20px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 300px;
    transition: box-shadow 0.2s;
    position: relative;
    text-align: center;
  }
  &__circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #eaf3fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.1rem;
    overflow: hidden;
    img {
      width: 80px;
      height: 80px;
      object-fit: contain;
      border-radius: 50%;
      background: #fff;
    }
    &--icon {
      background: #eaf3fa;
      color: var(--blue-dark);
      font-size: 2.7rem;
      ion-icon {
        font-size: 2.7rem;
      }
    }
  }
  &__card-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #101820;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  &__card-desc {
    font-size: 1rem;
    color: #444;
    text-align: center;
    font-weight: 400;
    margin-bottom: 0.7rem;
  }
  &__card-link {
    font-size: 1rem;
    color: var(--blue);
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.2s;
    &:hover {
      color: var(--blue-dark);
      text-decoration: underline;
    }
    ion-icon {
      font-size: 1.1rem;
    }
  }
}
@media (max-width: 900px) {
  .gov-institutions__card {
    min-width: 200px;
  }
}
@media (max-width: 600px) {
  .gov-institutions__card {
    width: 100%;
    max-width: 350px;
  }
  .gov-institutions__title {
    font-size: 1.5rem;
  }
}
</style> 