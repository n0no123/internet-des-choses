import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/account/SignInView.vue'
import SignUpView from '../views/account/SignUpView.vue'
import { useAccountStore } from '@/stores/account';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignInView
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpView
    }
  ]
});

router.beforeEach((to, from, next) => {
  const store = useAccountStore();

  if (to.name === 'home' && store.account.token === '') {
    next({name: 'sign-in'});
  } else {
    next();
  }
});

export default router
