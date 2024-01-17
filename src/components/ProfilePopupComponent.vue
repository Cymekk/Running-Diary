<template>
	<div
		class="popup fixed inset-0 transition-transform-opacity duration-700 bg-black/50 z-50"
		:class="{ '-translate-y-[150%] opacity-0': !modelValue, 'translate-y-0 opacity-100': modelValue }"
	>
		<div
			class="flex flex-col p-[16px] bg-[#17264D] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[80%] max-w-[600px] text-[#8F9DBF] shadow-[0_0_5px_5px_rgba(108,124,166,0.5)]"
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
