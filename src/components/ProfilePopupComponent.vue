<template>
	<div class="popup">
		<div
			class="flex flex-col p-6 bg-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-4/5 max-w-md shadow-lg shadow-white"
			ref="targetRef"
		>
			<slot name="profile-details-popup"></slot>
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
		required: true,
	},
})

//emits
const emit = defineEmits(['update:modelValue'])

//close popup function
const closePopup = () => {
	emit('update:modelValue', false)
}

//handling click outside
const targetRef = ref(null)
onClickOutside(targetRef, () => closePopup())
</script>
