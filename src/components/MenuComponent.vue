<template>
	<main class="menu">
		<aside class="menu__container" ref="targetRef">
			<button class="close-btn" @click="closeMenu"></button>
			<ul>
				<li>Hello, {{ storeAuth.user.name }}</li>
				<RouterLink to="/"><li>Home</li></RouterLink>
				<li>Stats</li>
				<li><button @click="storeAuth.logoutUser">Logout</button></li>
			</ul>
		</aside>
	</main>
</template>

<script setup>
//imports
import { ref } from 'vue'
import { useStoreAuth } from '../stores/storeAuth'
import { onClickOutside } from '@vueuse/core'

//stores
const storeAuth = useStoreAuth()

//props
const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true,
	},
})

//emits
const emit = defineEmits(['update:modelValue'])

//closing menu by update:modelValue
const closeMenu = () => {
	emit('update:modelValue', false)
}

//handling click outside
const targetRef = ref(null)

onClickOutside(targetRef, () => closeMenu())
</script>

<style lang="scss" scoped>
.menu {
	position: fixed;
	top: 0;
	transform: translateX(150%);
	width: 100%;

	min-height: 100svh;

	background-color: rgba(0, 0, 0, 0.45);

	transition: transform 0.3s;
	&__container {
		display: flex;
		align-items: center;
		justify-content: center;

		position: absolute;
		right: 0;
		top: 0;

		width: 60%;
		max-width: 400px;
		min-height: 100svh;

		background-color: #000000;
		background-image: linear-gradient(315deg, #000000 0%, #414141 74%);

		ul {
			list-style: none;
			color: #fff;
			font-size: 1.2rem;
			text-align: center;

			a {
				text-decoration: none;
				color: #fff;
			}

			li {
				margin: 1rem;

				button {
					background-color: var(--button-primary-color);
					padding: 1rem 2rem;
					border: none;
					border-radius: 10px;
					font-weight: bold;
				}
			}
		}

		.close-btn {
			position: absolute;
			right: 10px;
			top: 10px;
			width: 50px;
			height: 50px;

			background: none;
			background-image: url('../assets/x.svg');
			background-position: center;
			background-repeat: no-repeat;

			border: none;
		}
	}
}

.active {
	transform: translateX(0);
}
</style>
