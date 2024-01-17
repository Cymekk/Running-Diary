<template>
	<div class="container max-w-[600px] pb-[32px]">
		<NavbarComponent title="Your Profile" />

		<!-- Profile Details Section -->
		<SectionComponent>
			<template #basic-information>
				<h3 class="title mt-[16px]">Basic Information</h3>

				<!-- name input -->
				<label for="name" class="label" :class="{ 'label-no-error': !v$.name.$error, 'label-error': v$.name.$error }"
					>Name:</label
				>
				<div
					class="input-box w-1/2 mx-auto"
					:class="{
						empty: v$.name.$error,
						'no-empty': !v$.name.$error,
					}"
				>
					<input type="text" v-model="profileDetails.name" class="input" :class="{ empty: v$.name.$error }" />
					<i class="fa-solid fa-user icon"></i>
				</div>
				<span class="input-error" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>

				<!-- surname input -->
				<label
					for="surname"
					class="label"
					:class="{ 'label-no-error': !v$.surname.$error, 'label-error': v$.surname.$error }"
					>Surname:</label
				>
				<div
					class="input-box w-1/2 mx-auto"
					:class="{
						empty: v$.surname.$error,
						'no-empty': !v$.surname.$error,
					}"
				>
					<input type="text" v-model="profileDetails.surname" :class="{ empty: v$.surname.$error }" class="input" />
					<i class="fa-solid fa-user icon"></i>
				</div>
				<span class="input-error" v-if="v$.surname.$error">{{ v$.surname.$errors[0].$message }}</span>

				<!-- weight input -->
				<label
					for="weight"
					class="label"
					:class="{ 'label-no-error': !v$.weight.$error, 'label-error': v$.weight.$error }"
					>Weight:</label
				>
				<div
					class="input-box w-1/2 mx-auto"
					:class="{
						empty: v$.weight.$error,
						'no-empty': !v$.weight.$error,
					}"
				>
					<input
						type="number"
						v-model="profileDetails.weight"
						:class="{ empty: v$.weight.$error }"
						@focusout="fixNumber"
						class="input"
					/>
					<i class="fa-solid fa-weight-hanging icon"></i>
				</div>
				<span class="input-error" v-if="v$.weight.$error && v$.weight.$errors[0].$message">{{
					v$.weight.$errors[0].$message
				}}</span>
				<span class="error" v-if="v$.weight.$error && !v$.weight.$errors[0].$message"
					>Weight value should be from range 1kg to 150kg</span
				>

				<button class="button mb-[32px]" @click="updateBasicInformation()">Update</button>
			</template>
		</SectionComponent>

		<!-- Profile Image Upload Section -->
		<SectionComponent>
			<template #profile-picture>
				<h3 class="title mb-[16px]">Upload profile picture</h3>
				<div class="flex justify-center">
					<button
						class="button m-0 relative overflow-hidden disabled:opacity-40 disabled:pointer-events-none"
						:disabled="isTestAccount"
					>
						Select File
						<input type="file" class="absolute top-0 left-0 py-4 opacity-0" @change="showPicture($event)" />
					</button>
					<button
						class="button m-0 ml-[16px] disabled:opacity-40 disabled:pointer-events-none"
						@click="uploadFile"
						:disabled="!picture"
					>
						Upload File
					</button>
				</div>
				<span class="text-[#8F9DBF]" v-if="picture">Selected File: {{ picture.name }}</span>
				<span class="input-error" v-if="isError"> Only "jpg" and "png" files are supported</span>

				<div
					v-if="photo"
					class="h-[300px] w-[300px] relative bg-[#344573] shadow-[0_0_5px_5px_rgba(108,124,166,0.5)] rounded-full overflow-hidden mx-auto my-[24px]"
				>
					<img :src="photo" alt="profile image" class="object-fill h-[300px] w-[300px]" />
				</div>
				<span class="test-account-info mt-[16px] font-semibold" v-if="isTestAccount"
					>Upload profile picture feature isn't available on test account</span
				>
			</template>
		</SectionComponent>

		<!-- Change Password Section -->
		<SectionComponent>
			<template #change-password>
				<h3 class="title my-[32px]">Change Password</h3>
				<form @submit.prevent="validateChangePassword()">
					<label
						class="label"
						:class="{
							'label-no-error': !passwordV$.firstPassword.$error,
							'label-error': passwordV$.firstPassword.$error,
						}"
						>Password:</label
					>
					<div
						class="input-box w-1/2 mx-auto"
						:class="{
							empty: passwordV$.firstPassword.$error,
							'no-empty': !passwordV$.firstPassword.$error,
						}"
					>
						<input
							type="password"
							autocomplete="off"
							v-model="passwordDetails.firstPassword"
							:class="{ empty: passwordV$.firstPassword.$error }"
							class="input"
						/>
						<i class="fa-solid fa-lock icon"></i>
					</div>
					<span class="input-error" v-if="passwordV$.firstPassword.$error">{{
						passwordV$.firstPassword.$errors[0].$message
					}}</span>

					<label
						class="label"
						:class="{
							'label-no-error': !passwordV$.repeatedPassword.$error,
							'label-error': passwordV$.repeatedPassword.$error,
						}"
						>Repeat Password:</label
					>
					<div
						class="input-box w-1/2 mx-auto"
						:class="{
							empty: passwordV$.repeatedPassword.$error,
							'no-empty': !passwordV$.repeatedPassword.$error,
						}"
					>
						<input
							type="password"
							autocomplete="off"
							v-model="passwordDetails.repeatedPassword"
							:class="{ empty: passwordV$.repeatedPassword.$error }"
							class="input"
						/>
						<i class="fa-solid fa-lock icon"></i>
					</div>
					<span class="input-error" v-if="passwordV$.repeatedPassword.$error">{{
						passwordV$.repeatedPassword.$errors[0].$message
					}}</span>
					<input
						type="submit"
						value="Change Password"
						class="cursor-pointer bg-[#8F9DBF] px-4 py-2 rounded-md text-[#0A1633] font-semibold hover:bg-[#293A66] hover:text-[#8F9DBF] transition-colors duration-300 mx-auto block disabled:opacity-40 disabled:pointer-events-none"
						:disabled="isTestAccount"
					/>
				</form>
				<span v-if="isTestAccount" class="test-account-info mt-[16px] font-semibold"
					>Change password feature isn't available on test account</span
				>
			</template>
		</SectionComponent>

		<!-- Remove Account Section -->
		<SectionComponent class="border-b-0">
			<template #remove-account>
				<h3 class="title my-[32px]">Remove account</h3>
				<button
					class="button bg-red-700 text-white mb-0 mt-4 disabled:opacity-40 disabled:pointer-events-none"
					@click="accountRemovalHandler = true"
					:disabled="isTestAccount"
				>
					Remove
				</button>
				<span v-if="isTestAccount" class="test-account-info mt-[16px] font-semibold"
					>Remove account feature isn't available on test account</span
				>
			</template>
		</SectionComponent>
	</div>

	<!-- Popups -->
	<!-- Profile Details Update Popup -->
	<ProfilePopupComponent @wheel.prevent @touchmove.prevent @scroll.prevent v-model="profileDetailsHandler">
		<template #profile-details-popup>
			<p class="text-base text-center">Profile details has been updated successfully</p>
			<button class="button mt-[16px]" @click="profileDetailsHandler = false">Close</button>
		</template>
	</ProfilePopupComponent>

	<!-- Password Changed Popup -->
	<ProfilePopupComponent
		@wheel.prevent
		@touchmove.prevent
		@scroll.prevent
		:class="{ active: passwordChangeHandler }"
		v-model="passwordChangeHandler"
	>
		<template #profile-details-popup>
			<p class="text-base text-center">Your password has been changed successfully</p>
			<button class="button mt-4 mx-auto mb-0" @click="passwordChangeHandler = false">Close</button>
		</template>
	</ProfilePopupComponent>

	<!-- Account Removal Popup -->
	<ProfilePopupComponent
		@wheel.prevent
		@touchmove.prevent
		@scroll.prevent
		:class="{ active: accountRemovalHandler }"
		v-model="accountRemovalHandler"
	>
		<template #profile-details-popup>
			<p class="text-base text-center">
				If you delete your account, you will permanently lose your data. To do that enter your email address below
			</p>
			<label
				class="label mt-[16px]"
				:class="{
					'label-no-error': !emailV$.email.$error,
					'label-error': emailV$.email.$error,
				}"
				>Email:</label
			>
			<div
				class="input-box w-full mx-auto"
				:class="{
					empty: emailV$.email.$error,
					'no-empty': !emailV$.email.$error,
				}"
			>
				<input type="email" v-model="emailDetails.email" class="input" />
				<i class="fa-solid fa-user icon"></i>
			</div>
			<span class="input-error" v-if="emailV$.email.$error">{{ emailV$.email.$errors[0].$message }}</span>
			<div class="flex flex-row justify-center">
				<button class="button m-0" @click="closePopup">Close</button>
				<button class="button m-0 ml-[16px] bg-red-700 text-white" @click="checkEmail">Remove</button>
			</div>
		</template>
	</ProfilePopupComponent>
</template>

<script setup>
//imports
import { ref, reactive, computed, watch } from 'vue'
import { useStoreAuth } from '../stores/storeAuth'
import { getStorage, ref as storageReference, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { required, email, minLength, alpha, sameAs } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import NavbarComponent from '../components/NavbarComponent.vue'
import SectionComponent from '../components/SectionComponent.vue'
import ProfilePopupComponent from '../components/ProfilePopupComponent.vue'

//store
const storeAuth = useStoreAuth()
const photo = computed(() => storeAuth.user.photo)

//is test account
const isTestAccount = computed(() => {
	return storeAuth.isTestAccount
})

//handling "Basic Information Section"
let profileDetails = reactive({
	name: storeAuth.user.name,
	surname: storeAuth.user.surname,
	weight: storeAuth.user.weight,
})

//handler of showing popup after successfully updated profile details
const profileDetailsHandler = ref(false)

watch(profileDetailsHandler, newVal => {
	if (!newVal) {
		profileDetails.name = storeAuth.user.name
		profileDetails.surname = storeAuth.user.surname
		profileDetails.weight = storeAuth.user.weight
	}
})

//formatting weight for 2 digits place
const fixNumber = () => {
	profileDetails.weight = profileDetails.weight.toFixed(2)
}

//custom validation of weight
const checkWeight = value => value > 0 && value <= 150

const profileRules = computed(() => {
	return {
		name: {
			required,
			alpha,
		},
		surname: {
			required,
			alpha,
		},
		weight: {
			required,
			checkWeight,
		},
	}
})

const v$ = useValidate(profileRules, profileDetails)

const updateBasicInformation = () => {
	v$.value.$validate()
	if (!v$.value.$error) {
		storeAuth.updateProfileDetails(profileDetails)
		profileDetailsHandler.value = true
	}
}

//Upload Profile Image Section
const picture = ref('')
const isError = ref(false)

const showPicture = e => {
	picture.value = e.target.files[0]
}

const uploadFile = () => {
	const formatFiles = picture.value.name.split('.')[picture.value.name.split('.').length - 1]

	if (formatFiles === 'png' || formatFiles === 'jpg') {
		const storage = getStorage()
		const storageRef = storageReference(storage, `pictures/${storeAuth.user.id}/${picture.value.name}`)

		const uploadTask = uploadBytesResumable(storageRef, picture.value)
		uploadTask.on('state_changed', () => {
			// Upload completed successfully, now we can get the download URL
			getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
				storeAuth.updateProfileImage(downloadURL)
				storeAuth.changeProfileImg()
			})
		})

		picture.value = ''
		isError.value = false
	} else {
		console.log('error')
		isError.value = true
	}
}

//Change Password Section
const passwordChangeHandler = ref(false)

const passwordDetails = reactive({
	firstPassword: '',
	repeatedPassword: '',
})

const passwordRules = computed(() => {
	return {
		firstPassword: {
			required,
			minLength: minLength(7),
		},
		repeatedPassword: {
			required,
			sameAs: sameAs(passwordDetails.firstPassword),
		},
	}
})

const passwordV$ = useValidate(passwordRules, passwordDetails)
const validateChangePassword = () => {
	passwordV$.value.$validate()
	if (!passwordV$.value.$error) {
		passwordChangeHandler.value = true
		storeAuth.updateUserPassword(passwordDetails.firstPassword)
		passwordV$.value.$reset()
		passwordDetails.firstPassword = ''
		passwordDetails.repeatedPassword = ''
	}
}

//Acount Removal Section
const accountRemovalHandler = ref(false)

const emailDetails = reactive({
	email: '',
})

const emailRules = computed(() => {
	return {
		email: {
			required,
			email,
			sameAs: sameAs(storeAuth.user.email),
		},
	}
})

const emailV$ = useValidate(emailRules, emailDetails)
const checkEmail = () => {
	emailV$.value.$validate()
	if (!emailV$.value.$error) {
		storeAuth.removeAccount()
		accountRemovalHandler.value = false
	}
}

const closePopup = () => {
	accountRemovalHandler.value = false
}
</script>
