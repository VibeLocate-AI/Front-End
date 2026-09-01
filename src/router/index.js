import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import SignUpPage from '../components/SignUpPage.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import VerificationCode from '../components/VerificationCode.vue'
import ResetPasswordPage from '../components/ResetPasswordPage.vue'
import ResetSuccessPage from '../components/ResetSuccessPage.vue'
import LandingPage from '../components/LandingPage.vue'
import HomePage from '../components/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: SignUpPage,
    alias: '/signup'
  },
  {
    path: '/verify',
    name: 'Verify',
    component: VerificationCode
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    alias: '/forgot'
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordPage
  },
  {
    path: '/reset-success',
    name: 'ResetSuccess',
    component: ResetSuccessPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
