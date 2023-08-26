<template>
	<PopupComponent>
		<template #login-form>
			<form
				@submit.prevent="Reset"
				class="flex flex-col items-center bg-neutral-200 rounded-lg w-4/5 max-w-md p-4 z-20"
			>
				<h3 class="text-lg my-2">Reset Password</h3>

				<div class="inputs-box" :class="{ margin: v$.mail.$error }">
					<input
						type="text"
						class="inputs"
						placeholder="Email"
						v-model="mail.mail"
						:class="{ empty: v$.mail.$error }"
					/>
					<i class="fa-regular fa-envelope icons"></i>
				</div>
				<span v-if="v$.mail.$error" class="inputs-errors">{{ v$.mail.$errors[0].$message }}</span>
				<button type="submit" class="button">Reset</button>
				<p class="text-base">Do you have account?<RouterLink to="login" class="links">Sign in here.</RouterLink></p>
				<p class="text-base">
					Don't have account? <RouterLink to="register" class="links">Create it here.</RouterLink>
				</p>
			</form></template
		></PopupComponent
	>
</template>

<script setup>
import { computed, reactive } from 'vue'
import PopupComponent from '../components/PopupComponent.vue'
import { useStoreAuth } from '../stores/storeAuth'
import useValidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const storeAuth = useStoreAuth()

const mail = reactive({
	mail: '',
})
const rules = computed(() => {
	return {
		mail: {
			required,
			email,
		},
	}
})

const v$ = useValidate(rules, mail)

const Reset = () => {
	v$.value.$validate()
	if (!v$.value.$error) {
		storeAuth.resetPassword(mail)
	}
}
</script>
