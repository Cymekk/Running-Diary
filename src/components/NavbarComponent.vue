<template>
	<nav class="min-h-fit flex flex-row justify-between py-4 items-center">
		<slot name="home"> </slot>
		<slot name="profile"> </slot>
		<button class="bg-[url('../assets/menu.svg')] burger bg-no-repeat bg-center w-10 h-10" @click="showMenu"></button>
	</nav>
</template>

<script setup>
const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true,
	},
})

const emit = defineEmits(['update:modelValue'])

const showMenu = () => {
	emit('update:modelValue', true)
}
</script>
