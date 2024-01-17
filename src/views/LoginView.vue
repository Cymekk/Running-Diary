<template>
	<PopupComponent>
		<template #login-form>
			<div class="form">
				<h3 class="font-semibold mb-[16px] text-[26px] text-[#8F9DBF]">Login</h3>
				<form @submit.prevent="Login" class="">
					<!-- email box -->
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
						<input type="text" class="input" v-model="credentials.email" :class="{ empty: v$.email.$error }" />
						<i class="fa-regular fa-envelope icon"></i>
					</div>
					<span v-if="v$.email.$error" class="input-error">{{ v$.email.$errors[0].$message }}</span>

					<!-- password box -->
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
							autocomplete="off"
							v-model="credentials.password"
							:class="{ empty: v$.password.$error }"
						/>
						<i class="fa-solid fa-lock icon"></i>
					</div>
					<span v-if="v$.password.$error" class="input-error">{{ v$.password.$errors[0].$message }}</span>

					<input type="submit" value="Login" class="form-submit cursor-pointer" />

					<p class="text-[#8F9DBF] mt-[16px]">
						Don't have account?
						<RouterLink to="register" class="link">Create it here.</RouterLink>
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
