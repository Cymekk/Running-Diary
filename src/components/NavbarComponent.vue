<template>
	<nav class="max-w-[600px] container flex flex-row justify-between p-[16px] items-center">
		<RouterLink to="profile-page"
			><button
				class="w-[40px] h-[40px] rounded-full border-2 border-[#8F9DBF] bg-no-repeat bg-center bg-contain"
				v-if="storeAuth.user.photo"
				:style="{ backgroundImage: `url(${storeAuth.user.photo})` }"
			></button
			><button
				class="w-[40px] h-[40px] bg-[url('../assets/icons/user.svg')] rounded-full border-2 border-[#8F9DBF] bg-no-repeat bg-center bg-contain"
				v-if="!storeAuth.user.photo"
			></button
		></RouterLink>
		<h2 class="title">{{ title }}</h2>
		<button
			@click="menuActive = true"
			class="bg-[url('../assets/icons/menu.svg')] bg-no-repeat bg-center w-[40px] h-[40px]"
		></button>
	</nav>
	<MenuComponent v-model="menuActive" />
</template>

<script setup>
//imports
import { ref } from 'vue'
import { useStoreAuth } from '../stores/storeAuth'
import MenuComponent from './MenuComponent.vue'

//store
const storeAuth = useStoreAuth()

//props
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
})

const menuActive = ref(false)
</script>
