<template>
  <footer class="site-footer">
    <div class="site-footer__container">
      <div class="site-footer__brand">
        <div class="logo">
          <router-link :to="{ name: 'home' }" class="logo">
            <span class="logo-main">Gira</span>
            <span class="logo-dot">.</span>
            <span class="logo-bold">Ijambo</span>
          </router-link>
        </div>
        <p class="site-footer__desc">
          Gira Ijambo, umuyoboro wizewe wo kugeza igitekerezo n’ikibazo cyawe kuri Leta, ndetse no gukurikirana ikibazo cyawe kugeza gikemuwe, mu buryo bworoshye
        </p>
        <ul class="site-footer__contact">
          <li>
            <a href="tel:+250781234567"><ion-icon name="call-outline"></ion-icon> +250 781 234 567</a>
          </li>
          <li>
            <a href="mailto:info@gira-ijambo.vercel.app"><ion-icon name="mail-outline"></ion-icon> info@gira-ijambo.vercel.app</a>
          </li>
          <li>
            <a href="https://goo.gl/maps/1234567890" target="_blank" rel="noopener"><ion-icon name="location-outline"></ion-icon> Kigali, Rwanda</a>
          </li>
        </ul>
      </div>
      <div class="site-footer__links">
        <div>
          <h4>Ibikurikizwa</h4>
          <ul>
            <li><a href="">Politiki y'Ibanga</a></li>
            <li><a href="">Amabwiriza</a></li>
            <li><a href="">Ibibazo Bikunze Kubazwa</a></li>
          </ul>
        </div>
        <div>
          <h4>Serivisi</h4>
          <ul>
            <li><a href="">Gutanga Ikibazo</a></li>
            <li><a href="">Gukurikirana Ikibazo</a></li>
            <li><a href="">Inzego za Leta</a></li>
          </ul>
        </div>
        <div>
          <h4>Abo Turi Bo</h4>
          <ul>
            <li><a href="">Abo Turi Bo</a></li>
            <li><a href="">Twandikire</a></li>
            <li><a href="">Ubufasha</a></li>
          </ul>
        </div>
        <div>
          <h4>Dukurikire</h4>
          <div class="site-footer__socials">
            <span><ion-icon name="logo-facebook"></ion-icon></span>
            <span><ion-icon name="logo-twitter"></ion-icon></span>
            <span><ion-icon name="logo-instagram"></ion-icon></span>
          </div>
        </div>
      </div>
    </div>
    <div class="site-footer__bottom">
      <span>© {{ new Date().getFullYear() }} Gira Ijambo.</span>
      <span>Yakowe na <a href="https://github.com/umunyarwanda/" target="_blank" rel="noopener">Mugabo</a></span>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No script needed for static footer
</script>

<style scoped lang="scss">
.site-footer {
  background: var(--white);
  padding: 2.5rem 0 0.5rem 0;
  border-top: 1px solid #ececec;
  font-size: 1rem;
  color: #222;
  width: 100%;
  &__container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2.5rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    flex-wrap: wrap;
  }
  &__brand {
    flex: 1.5;
    min-width: 260px;
    max-width: 350px;

    @media (max-width: 600px) {
      min-width: 100%;
      width: 100%;
    }
  }
  &__desc {
    font-size: .97rem;
    color: #444;
    margin-bottom: 1.2rem;
    font-weight: 400;
    line-height: 1.5;
  }
  &__contact {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1rem;
      color: var(--blue);
      margin-bottom: 0.4rem;
      ion-icon {
        font-size: 1.2rem;
      }

      a {
        display: flex;
        align-items: center;
        gap: 0.6rem;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  &__links {
    display: flex;
    flex: 3;
    justify-content: space-between;
    gap: 20px;
    min-width: 400px;
    flex-wrap: wrap;

    @media (max-width: 600px) {
      min-width: 100%;
      width: 100%;
    }
    > div {
      min-width: 140px;
      margin-bottom: 1.2rem;

      @media (max-width: 507px) {
        min-width: 100%;
        width: 100%;
      }
    }
    h4 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.7rem;
      color: #222;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        margin-bottom: 0.5rem;
        color: #444;
        font-size: .97rem;
        cursor: pointer;
        transition: color 0.2s;
        &:hover {
          color: var(--blue);
        }
      }
    }
  }
  &__socials {
    display: flex;
    gap: 1rem;
    span {
      background: #eaf3fa;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      color: #222;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
      &:hover {
        background: var(--blue);
        color: #fff;
      }
    }
  }
  &__bottom {
    border-top: 1px solid #e2e8f0;
    margin-top: 2.5rem;
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    color: #888;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    flex-wrap: wrap;
    span:last-child {
      font-size: .97rem;
      color: #888;
    }

    a {
      color: #888;
      text-decoration: none;
      color: var(--blue);
      font-weight: 800;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
// @media (max-width: 900px) {
//   .site-footer__container {
//     flex-direction: column;
//     gap: 2rem;
//     align-items: flex-start;
//   }
//   .site-footer__links {
//     flex-wrap: wrap;
//     gap: 1.5rem;
//   }
//   .site-footer__bottom {
//     flex-direction: column;
//     gap: 0.7rem;
//     align-items: flex-start;
//   }
// }
// @media (max-width: 600px) {
//   .site-footer__container {
//     padding: 0 0.5rem;
//   }
//   .site-footer__links {
//     flex-direction: column;
//     gap: 1.2rem;
//   }
//   .site-footer__bottom {
//     padding: 1.2rem 0.5rem 0.2rem 0.5rem;
//   }
// }
</style> 