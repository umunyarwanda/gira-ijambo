<template>
  <aside class="navbar">
    <div class="navbar-inner">
      <div class="navbar-header">
        <div class="logo navbar-logo">
          <span class="logo-main">Gira</span>
          <span class="logo-dot">.</span>
          <span class="logo-bold">Ijambo</span>
        </div>
        <button class="navbar-toggle" @click="globalStore.toggleNav">
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>
      <div class="navbar-main">
        <router-link to="/dashboard" class="navbar-item">
          <span class="material-symbols-rounded">dashboard</span>
          Dashboard
        </router-link>
        <div class="navbar-group">
          <h2>Complaints Management</h2>
          <router-link :to="{name: 'complaints'}" class="navbar-item">
            <span class="material-symbols-rounded">record_voice_over</span>
            Complaints
          </router-link>
          <!-- <router-link to="/attendance" class="navbar-item">
            <span class="material-symbols-rounded">format_list_numbered</span>
            Attendance Record
          </router-link> -->
        </div>
        <div class="navbar-group">
          <h2>System Management</h2>
          <router-link :to="{ name: 'users' }" class="navbar-item">
            <span class="material-symbols-rounded">group</span>
            Users
          </router-link>
          <router-link :to="{ name: 'agencies' }" class="navbar-item">
            <span class="material-symbols-rounded">apartment</span>
            Agencies
          </router-link>
          <router-link :to="{ name: 'categories' }" class="navbar-item">
            <span class="material-symbols-rounded">sort</span>
            Agency Categories
          </router-link>
        </div>
        <div class="navbar-group">
          <h2>My Account</h2>
          <!-- <router-link to="/profile" class="navbar-item">
            <span class="material-symbols-rounded">person</span>
            Profile
          </router-link> -->
          <button @click="logout" class="navbar-item">
            <span class="material-symbols-rounded">logout</span>
            Logout
          </button>
        </div>

      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import Logo from '@/assets/images/logo.svg';
  import { AuthActionTypes } from '@/stores/actions/action-types.enum';
  import { useAuthStore } from '@/stores/auth';
  import { rolesPermissions } from '@shared/constants/auth/roles.constants';
  import { EUserRole } from '@shared/enums/EUserRole.enum';
  import { permissions } from "@shared/constants/auth/permissions.constants";
import { useGlobalStore } from '@/stores/global';

  const authStore = useAuthStore();
  const globalStore = useGlobalStore();

  const logout = () => {
    authStore[AuthActionTypes.LOGOUT]();
  }

</script>

<style scoped lang="scss">
  aside {
    overflow-y: auto;
    height: 100vh;
    visibility: hidden;

    .navbar-inner {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background-color: var(--white);
      visibility: visible;

      .navbar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 10px 2px;

        .navbar-toggle {
          border: none;
          background-color: transparent;
          cursor: pointer;
          font-size: 1.5rem;
          width: 37px;
          height: 37px;
          background: rgba(215, 215, 215, 0.5);
          color: var(--blue-dark);
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          display: none;

          @media (max-width: 800px) {
            display: flex;
          }

          &:hover {
            background: rgba(215, 215, 215, 0.7);
          }
          
        }
        
      }
      .navbar-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        // padding: 12px 5px 2px;
        font-size: 1.5rem;
  
        img {
          width: 100px;
          height: 100px;
          -webkit-user-drag: none;
        }
      }
  
      .navbar-main {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px 10px 10px 15px;
  
        .navbar-group {
          margin-top: 15px;
          h2 {
            font-size: .75rem;
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 10px;
            text-transform: uppercase;
            opacity: .6;
            white-space: nowrap;
          }
  
          a {
            &:not(:last-child) {
              margin-bottom: 10px;
            }
          }
        }
  
        a, .navbar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          color: var(--text-primary);
          font-size: .87rem;
          font-weight: 500;
          position: relative;
          transition: all .3s ease;
          white-space: nowrap;
          width: 100%;
          outline: none;
          border: none;
          background-color: transparent;
          cursor: pointer;
  
          &::before {
            position: absolute;
            content: '';
            width: 5px;
            height: 100%;
            top: 0;
            left: -10px;
            border-radius: inherit;
            transition: all .3s ease;
          }
  
          span {
            font-weight: 300;
            transition: all .3s ease;
          }
  
          &:hover {
            color: var(--blue);
            background-color: var(--pale-blue);
  
            span {
              color: var(--blue);
            }
          }
  
  
          &.router-link-exact-active {
            color: var(--blue);
            background-color: var(--pale-blue);
  
            &::before {
              background-color: var(--blue);
            }
  
            span {
              color: var(--blue);
            }
          }
        }
      }
    }

    &:hover {
      visibility: visible;
    }

    // hide

  }
</style>