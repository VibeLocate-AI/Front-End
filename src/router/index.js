import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import SignUpPage from '../components/SignUpPage.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import VerificationCode from '../components/VerificationCode.vue'
import ResetPasswordPage from '../components/ResetPasswordPage.vue'
import ResetSuccessPage from '../components/ResetSuccessPage.vue'
import LandingPage from '../components/LandingPage.vue'
import HomePage from '../components/HomePage.vue'
import MapPage from '../components/MapPage.vue'
import ProfilePage from '../components/ProfilePage.vue'
import AddPropertyPage from '../components/AddPropertyPage.vue'
import RentPage from '../components/RentPage.vue'
import PropertyDetailsPage from '../components/PropertyDetailsPage.vue'
import OwnerPropertiesPage from '../components/OwnerPropertiesPage.vue'
import NewProjectsPage from '../components/NewProjectsPage.vue'
import AboutPage from '../components/AboutPage.vue'
import FavoritesPage from '../components/FavoritesPage.vue'

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
    path: '/rent',
    name: 'Rent',
    component: RentPage
  },
  {
    path: '/new-projects',
    name: 'NewProjects',
    component: NewProjectsPage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage
  },
  {
    path: '/property/:id',
    name: 'PropertyDetails',
    component: PropertyDetailsPage
  },
  {
    path: '/my-properties',
    name: 'MyProperties',
    component: OwnerPropertiesPage
  },
  {
    path: '/map',
    name: 'Map',
    component: MapPage
  },
  {
    path: '/add-property',
    name: 'AddProperty',
    component: AddPropertyPage,
    alias: '/property/add'
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/profile/:tab',
    name: 'ProfileTab',
    component: ProfilePage
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
