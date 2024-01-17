<template>
	<div
		class="shadow bg-black/50 fixed inset-0 flex items-center justify-center z-40 transition-opacity-transform duration-700"
		:class="{ '-translate-y-full opacity-0': !modelValue, 'translate-y-0 opacity-100': modelValue }"
	>
		<div
			class="popup-body bg-[#101D40] text-[#6C7CA6] w-4/5 max-w-[400px] p-[32px] rounded-md font-semibold shadow-[0_0_2px_2px_rgba(108,124,166,0.3)] flex flex-col"
			ref="targetRef"
		>
			<slot name="edit-goal"></slot>
			<slot name="remove-popup"></slot>
			<slot name="remove-training"></slot>
			<slot name="edit-training"></slot>
			<slot name="add-training"></slot>
			<slot name="add-weight"></slot>
			<slot name="reset-test-account"></slot>
		</div>
	</div>
</template>

<script setup>
//imports
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

//props
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: true,
	},
})

//emit
const emit = defineEmits(['update:modelValue'])

//closing popup on clicking outside
const targetRef = ref(null)

const closePopup = () => {
	emit('update:modelValue', false)
}

onClickOutside(targetRef, closePopup)
</script>

<style lang="scss" scoped></style>
