import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ResetView from '../views/ResetView.vue'
import ProfileView from '../views/ProfileView.vue'
import StatsView from '../views/StatsView.vue'
import GoalsView from '../views/GoalsView.vue'
import AddGoalView from '../views/AddGoalView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView,
		},
		{
			path: '/register',
			name: 'register',
			component: RegisterView,
		},
		{
			path: '/reset',
			name: 'reset',
			component: ResetView,
		},
		{
			path: '/profile-page',
			name: 'profile-page',
			component: ProfileView,
		},
		{
			path: '/stats',
			name: 'stats',
			component: StatsView,
		},
		{
			path: '/goals',
			name: 'goals',
			component: GoalsView,
		},
		{
			path: '/addgoal',
			name: 'addgoal',
			component: AddGoalView,
		},
	],
})

export default router
