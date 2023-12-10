<template>
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center transition-transform duration-500"
		:class="{
			'-translate-y-[100%]': !modelValue,
			'translate-y-0': modelValue,
		}">
		<div
			class="popup-body bg-[#101D40] text-[#6C7CA6] w-4/5 max-w-[400px] p-[32px] rounded-md font-semibold shadow-[0_0_2px_2px_rgba(108,124,166,0.3)]"
			ref="targetRef">
			Are you sure that you want to delete training?
			<div class="buttons flex justify-center mt-[16px] space-x-[16px]">
				<button
					@click="closePopup()"
					class="button mx-0 bg-[#4D5F8C] text-[#B8C1D9] hover:text-[#4D5F8C] hover:bg-[#B8C1D9]">
					No
				</button>
				<button class="button mx-0" @click="deleteTraining()">Yes</button>
			</div>
		</div>
	</div>
</template>

<script setup>
//imports
import { onClickOutside } from "@vueuse/core"
import { ref } from "vue"
import { useStoreNotes } from "../stores/storeNotes"

//store
const storeNotes = useStoreNotes()

//props
const props = defineProps({
	modelValue: {
		type: Boolean,
	},
	id: {
		type: String,
	},
})

//emit
const emit = defineEmits(["update:modelValue"])

//close popup function
const closePopup = () => {
	emit("update:modelValue", false)
}

//closing popup on clicking outside
const targetRef = ref(null)

onClickOutside(targetRef, closePopup)

//function for delete note
const deleteTraining = () => {
	storeNotes.removeTraining(props.id)
}
</script>

<style lang="scss" scoped></style>
