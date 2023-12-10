<template>
	<PopupComponent>
		<template #login-form>
			<div class="form max-h-[70vh] overflow-y-scroll">
				<h3 class="font-semibold mb-[16px] text-[26px] text-[#8F9DBF]">Create Account</h3>
				<form @submit.prevent="Register">
					<!-- name input -->
					<label class="label" :class="{ 'label-no-error': !v$.name.$error, 'label-error': v$.name.$error }"
						>Name</label
					>
					<div
						class="input-box"
						:class="{
							empty: v$.name.$error,
							'no-empty': !v$.name.$error,
						}"
					>
						<input type="text" class="input" v-model="credentials.name" :class="{ empty: v$.name.$error }" />
						<i class="fa-solid fa-user icon"></i>
					</div>
					<span v-if="v$.name.$error" class="input-error">{{ v$.name.$errors[0].$message }}</span>

					<!-- surname input -->
					<label class="label" :class="{ 'label-no-error': !v$.surname.$error, 'label-error': v$.surname.$error }"
						>Surname</label
					>
					<div
						class="input-box"
						:class="{
							empty: v$.surname.$error,
							'no-empty': !v$.surname.$error,
						}"
					>
						<input type="text" class="input" v-model="credentials.surname" :class="{ empty: v$.surname.$error }" />
						<i class="fa-solid fa-user icon"></i>
					</div>
					<span v-if="v$.surname.$error" class="input-error">{{ v$.surname.$errors[0].$message }}</span>

					<!-- email input box -->
					<label class="label" :class="{ 'label-no-error': !v$.email.$error, 'label-error': v$.email.$error }"
						>Email</label
					>
					<div
						class="input-box"
						:class="{
							empty: v$.email.$error,
							'no-empty': !v$.email.$error,
						}"
					>
						<input type="email" class="input" v-model="credentials.email" :class="{ empty: v$.email.$error }" />
						<i class="fa-regular fa-envelope icon"></i>
					</div>
					<span v-if="v$.email.$error" class="input-error">{{ v$.email.$errors[0].$message }}</span>

					<!-- password input box -->
					<label class="label" :class="{ 'label-no-error': !v$.password.$error, 'label-error': v$.password.$error }"
						>Password</label
					>
					<div
						class="input-box"
						:class="{
							empty: v$.password.$error,
							'no-empty': !v$.password.$error,
						}"
					>
						<input
							type="password"
							class="input"
							v-model="credentials.password"
							:class="{ empty: v$.password.$error }"
						/>
						<i class="fa-solid fa-lock icon"></i>
					</div>
					<span v-if="v$.password.$error" class="input-error">{{ v$.password.$errors[0].$message }}</span>

					<!-- repeat password box -->
					<label
						class="label"
						:class="{ 'label-no-error': !v$.repeatpassword.$error, 'label-error': v$.repeatpassword.$error }"
						>Repeat password</label
					>
					<div
						class="input-box"
						:class="{
							empty: v$.repeatpassword.$error,
							'no-empty': !v$.repeatpassword.$error,
						}"
					>
						<input
							type="password"
							class="input"
							v-model="credentials.repeatpassword"
							:class="{ empty: v$.repeatpassword.$error }"
						/>
						<i class="fa-solid fa-lock icon"></i>
					</div>
					<span v-if="v$.repeatpassword.$error" class="input-error">{{ v$.repeatpassword.$errors[0].$message }}</span>

					<input type="submit" value="Register" class="form-submit" />

					<p class="text-[#8F9DBF] mt-[16px]">
						Do you have account? <RouterLink to="login" class="link">Sign in here.</RouterLink>
					</p>
					<p class="text-[#8F9DBF]">Forgot password? <RouterLink to="reset" class="link">Reset it here.</RouterLink></p>
				</form>
			</div>
		</template>
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
