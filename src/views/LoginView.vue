<template>
	<PopupComponent>
		<template #login-form>
			<form @submit.prevent="Login" class="flex flex-col items-center bg-neutral-200 rounded-lg w-4/5 max-w-md p-4 z-20">
				<h3 class="text-lg my-2">Login</h3>
				<label class="labels">Email</label>
				<div class="inputs-box" :class="{ margin: v$.email.$error }">
					<input
						type="text"
						class="inputs"
						placeholder="Email"
						v-model="credentials.email"
						:class="{ empty: v$.email.$error }"
					/>
					<i class="fa-regular fa-envelope icons"></i>
				</div>
				<span v-if="v$.email.$error" class="inputs-errors">{{ v$.email.$errors[0].$message }}</span>

				<label class="labels">Password</label>
				<div class="inputs-box" :class="{ margin: v$.password.$error }">
					<input
						type="password"
						class="inputs"
						placeholder="Password"
						v-model="credentials.password"
						:class="{ empty: v$.password.$error }"
					/>
					<i class="fa-solid fa-lock icons"></i>
				</div>
				<span v-if="v$.password.$error" class="inputs-errors">{{ v$.password.$errors[0].$message }}</span>
				<button type="submit" class="button">Login</button>
				<p class="text-base">
					Don't have account?
					<RouterLink to="register" class="links">Create it here.</RouterLink>
				</p>
				<p class="text-base">Forgot password? <RouterLink to="reset" class="links">Reset it here.</RouterLink></p>
			</form></template
		>
	</PopupComponent>
</template>

<script setup>
//imports
import { computed, reactive } from 'vue'
import { useStoreAuth } from '../stores/storeAuth'
import { required, email, minLength } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import PopupComponent from '../components/PopupComponent.vue'

//stores
const storeAuth = useStoreAuth()

//credentials passed by inputs v-models
const credentials = reactive({
	email: '',
	password: '',
})

//validate ruls
const rules = computed(() => {
	return {
		email: {
			required,
			email,
		},
		password: {
			required,
			minLength: minLength(7),
		},
	}
})

//validation form
const v$ = useValidate(rules, credentials)

const Login = () => {
	v$.value.$validate()
	if (!v$.value.$error) {
		storeAuth.login(credentials)
	}
}
</script>

<style lang="scss" scoped></style>
