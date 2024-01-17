<template>
	<div
		class="menu fixed inset-0 z-50 bg-black/50 flex flex-row-reverse transition-opacity-transform duration-500"
		:class="{ 'opacity-0 translate-x-[100%]': !modelValue, 'opacity-100 translate-x-0': modelValue }"
	>
		<div
			class="links w-1/2 md:w-1/3 max-w-[400px] bg-[#101D40] text-[#6C7CA6] h-full relative flex justify-center items-center"
			ref="targetRef"
		>
			<button
				class="w-[40px] h-[40px] bg-[url('../assets/icons/x.svg')] bg-no-repeat bg-center absolute top-[15px] right-[15px]"
				@click="closeMenu"
			></button>
			<ul class="text-[20px]">
				<li class="text-center my-[16px] cursor-pointer">Hello, {{ storeAuth.user.name }}</li>
				<li class="text-center my-[16px] cursor-pointer" @click="changeView('/')">Home</li>
				<li class="text-center my-[16px] cursor-pointer" @click="changeView('goals')">Goals</li>
				<li class="text-center my-[16px] cursor-pointer" @click="changeView('stats')">Stats</li>
				<li class="text-center my-[16px] cursor-pointer">
					<button @click="storeAuth.logoutUser" class="button">Logout</button>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
//imports
import { ref } from 'vue'
import { useStoreAuth } from '../stores/storeAuth'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()

const changeView = view => {
	router.push(view)
	closeMenu()
}

//stores
const storeAuth = useStoreAuth()

//props
const props = defineProps({
	modelValue: {
		type: Boolean,
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

<style lang="scss" scoped></style>
