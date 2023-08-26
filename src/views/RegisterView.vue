<template>
	<PopupComponent>
		<template #login-form>
			<form
				@submit.prevent="Register"
				class="flex flex-col items-center bg-neutral-200 rounded-lg w-4/5 max-w-md p-4 z-20"
			>
				<h3 class="text-lg my-2">Create Account</h3>
				<label class="labels">Name</label>
				<div class="inputs-box" :class="{ margin: v$.name.$error }">
					<input
						type="text"
						class="inputs"
						placeholder="Name"
						v-model="credentials.name"
						:class="{ empty: v$.name.$error }"
					/>
					<i class="fa-solid fa-user icons"></i>
				</div>
				<span v-if="v$.name.$error" class="inputs-errors">{{ v$.name.$errors[0].$message }}</span>

				<label class="labels">Surname</label>
				<div class="inputs-box" :class="{ margin: v$.surname.$error }">
					<input
						type="text"
						class="inputs"
						placeholder="Surname"
						v-model="credentials.surname"
						:class="{ empty: v$.surname.$error }"
					/>
					<i class="fa-solid fa-user icons"></i>
				</div>
				<span v-if="v$.surname.$error" class="inputs-errors">{{ v$.surname.$errors[0].$message }}</span>

				<label class="labels">Email</label>
				<div class="inputs-box" :class="{ margin: v$.email.$error }">
					<input
						type="email"
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

				<label class="labels">Repeat password</label>
				<div class="inputs-box" :class="{ margin: v$.repeatpassword.$error }">
					<input
						type="password"
						class="inputs"
						placeholder="Password"
						v-model="credentials.repeatpassword"
						:class="{ empty: v$.repeatpassword.$error }"
					/>
					<i class="fa-solid fa-lock icons"></i>
				</div>
				<span v-if="v$.repeatpassword.$error" class="inputs-errors">{{ v$.repeatpassword.$errors[0].$message }}</span>

				<button type="submit" class="button">Register</button>
				<p class="text-base">Do you have account? <RouterLink to="login" class="links">Sign in here.</RouterLink></p>
				<p class="text-base">Forgot password? <RouterLink to="reset" class="links">Reset it here.</RouterLink></p>
			</form></template
		>
	</PopupComponent>
</template>

<script setup>
//imports
import { computed, reactive } from 'vue'
import PopupComponent from '../components/PopupComponent.vue'
import { useStoreAuth } from '../stores/storeAuth'
import useValidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'

//store
const storeAuth = useStoreAuth()

//reactive credentials object
const credentials = reactive({
	name: '',
	surname: '',
	email: '',
	password: '',
	repeatpassword: '',
})

const rules = computed(() => {
	return {
		name: {
			required,
		},

		surname: {
			required,
		},

		email: {
			required,
			email,
		},

		password: {
			required,
			minLength: minLength(7),
		},

		repeatpassword: {
			required,
			sameAs: sameAs(credentials.password),
		},
	}
})

const v$ = useValidate(rules, credentials)

const Register = () => {
	v$.value.$validate()
	if (!v$.value.$error) {
		storeAuth.registerUser(credentials)
	}
}
</script>
