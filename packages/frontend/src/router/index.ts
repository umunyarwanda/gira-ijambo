import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { AuthActionTypes } from '@/stores/actions/action-types.enum';
import { rolesPermissions } from '@shared/constants/auth/roles.constants';
import { EUserRole } from '@shared/enums/EUserRole.enum';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'site',
      component: () => import('../components/layouts/SiteLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/site/home.vue')
        },

        {
          path: 'ibibazo',
          name: 'site-complaints',
          component: () => import('../views/site/complaints.vue')
        },
        {
          path: 'ibibazo/:token',
          name: 'complaint',
          component: () => import('../views/site/complaint.vue')
        },
        {
          path: 'baza-ikibazo',
          name: 'submit-complaint',
          component: () => import('../views/site/submit.vue')
        },
        {
          path: 'login',
          name: 'login',
          meta: {
            authPage: true
          },
          component: () => import('../views/site/auth/login.vue')
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('../views/site/NotFound.vue')
        }
      ]

    },
    {
      path: '/dashboard',
      name: 'dashboard-layout',
      component: () => import('../components/layouts/DashboardLayout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/dashboard/index.vue')
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('../views/dashboard/categories.vue')
        },
        {
          path: 'agencies',
          name: 'agencies',
          component: () => import('../views/dashboard/agencies.vue')
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../views/dashboard/users.vue')
        },
        {
          path: 'complaints',
          name: 'complaints',
          component: () => import('../views/dashboard/complaints.vue')
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  const routeRequiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = useAuthStore()[AuthActionTypes.IS_AUTHENTICATED];
  // const permissions = to.meta.permissions as EUserRole[];

  if (routeRequiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.path === '/login' && isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
})


export default router
