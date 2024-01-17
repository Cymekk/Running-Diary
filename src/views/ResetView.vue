<template>
	<PopupComponent>
		<template #login-form>
			<div class="form">
				<h3 class="font-semibold mb-[16px] text-[26px] text-[#8F9DBF]">Reset Password</h3>
				<form @submit.prevent="Reset">
					<label class="label" :class="{ 'label-no-error': !v$.mail.$error, 'label-error': v$.mail.$error }"
						>Email</label
					>
					<div
						class="input-box"
						:class="{
							empty: v$.mail.$error,
							'no-empty': !v$.mail.$error,
						}"
					>
						<input type="text" class="input" v-model="mail.mail" :class="{ empty: v$.mail.$error }" />
						<i class="fa-regular fa-envelope icon"></i>
					</div>
					<span v-if="v$.mail.$error" class="input-error">{{ v$.mail.$errors[0].$message }}</span>
					<input type="submit" class="form-submit cursor-pointer" value="Reset" />

					<p class="text-[#8F9DBF] mt-[16px]">
						Do you have account?<RouterLink to="login" class="link">Sign in here.</RouterLink>
					</p>
					<p class="text-[#8F9DBF]">
						Don't have account? <RouterLink to="register" class="link">Create it here.</RouterLink>
					</p>
				</form>
			</div></template
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
