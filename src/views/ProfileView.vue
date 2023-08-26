<template>
	<main class="px-4">
		<NavbarComponent v-model="isActive">
			<template #profile>
				<h2 class="text-2xl text-white font-bold">Your Profile</h2>
			</template>
		</NavbarComponent>

		<!-- Profile Details Section -->
		<SectionComponent>
			<template #basic-information>
				<h3 class="title">Basic Information</h3>
				<label for="name" class="labels text-white">Name:</label>
				<div class="inputs-box" :class="{ margin: v$.name.$error }">
					<input
						type="text"
						placeholder="Name"
						v-model="profileDetails.name"
						class="inputs"
						:class="{ empty: v$.name.$error }"
					/>
					<i class="fa-solid fa-user icons"></i>
				</div>
				<span class="inputs-errors" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
				<label for="surname" class="labels text-white">Surname:</label>
				<div class="inputs-box" :class="{ margin: v$.surname.$error }">
					<input
						type="text"
						placeholder="Surname"
						v-model="profileDetails.surname"
						:class="{ empty: v$.surname.$error }"
						class="inputs"
					/>
					<i class="fa-solid fa-user icons"></i>
				</div>
				<span class="inputs-errors" v-if="v$.surname.$error">{{ v$.surname.$errors[0].$message }}</span>

				<label for="weight" class="labels text-white">Weight:</label>

				<div class="inputs-box" :class="{ margin: v$.weight.$error }">
					<input
						type="number"
						placeholder="Weight"
						v-model="profileDetails.weight"
						:class="{ empty: v$.weight.$error }"
						@focusout="fixNumber"
						class="inputs"
					/>
					<i class="fa-solid fa-weight-hanging icons"></i>
				</div>
				<span class="inputs-errors" v-if="v$.weight.$error && v$.weight.$errors[0].$message">{{
					v$.weight.$errors[0].$message
				}}</span>
				<span class="error" v-if="v$.weight.$error && !v$.weight.$errors[0].$message"
					>Weight value should be from range 1kg to 150kg</span
				>

				<button class="button mb-0" @click="updateBasicInformation()">Update</button>
			</template>
		</SectionComponent>

		<!-- Profile Image Upload Section -->
		<SectionComponent>
			<template #profile-picture>
				<h3 class="title">Upload profile picture</h3>

				<div class="flex justify-evenly w-full mt-4">
					<button class="button relative overflow-hidden">
						Select File
						<input type="file" class="absolute top-0 left-0 py-4 opacity-0" @change="showPicture($event)" />
					</button>
					<button class="button disabled:opacity-40" @click="uploadFile" :disabled="!picture">Upload File</button>
				</div>
				<span v-if="picture">Selected File: {{ picture.name }}</span>
				<span class="inputs-errors" v-if="isError"> Only "jpg" and "png" files are supported</span>

				<img v-if="photo" :src="photo" alt="profile image" class="w-4/5 rounded-xl" />
			</template>
		</SectionComponent>

		<!-- Change Password Section -->
		<SectionComponent>
			<template #change-password>
				<h3 class="title">Change Password</h3>
				<label for="password" class="labels text-white">Password:</label>
				<div class="inputs-box" :class="{ margin: passwordV$.firstPassword.$error }">
					<input
						type="password"
						placeholder="Password"
						v-model="passwordDetails.firstPassword"
						:class="{ empty: passwordV$.firstPassword.$error }"
						class="inputs"
					/>
					<i class="fa-solid fa-lock icons"></i>
				</div>
				<span class="inputs-errors" v-if="passwordV$.firstPassword.$error">{{
					passwordV$.firstPassword.$errors[0].$message
				}}</span>

				<label for="surname" class="labels text-white">Repeat Password:</label>
				<div class="inputs-box" :class="{ margin: passwordV$.repeatedPassword.$error }">
					<input
						type="password"
						placeholder="Repeat Password"
						v-model="passwordDetails.repeatedPassword"
						:class="{ empty: passwordV$.repeatedPassword.$error }"
						class="inputs"
					/>
					<i class="fa-solid fa-lock icons"></i>
				</div>
				<span class="inputs-errors" v-if="passwordV$.repeatedPassword.$error">{{
					passwordV$.repeatedPassword.$errors[0].$message
				}}</span>
				<button class="button mb-0" @click="validateChangePassword">Change Password</button>
			</template>
		</SectionComponent>

		<!-- Remove Account Section -->
		<SectionComponent class="border-b-0">
			<template #remove-account>
				<h3 class="title">Remove account</h3>
				<button class="button bg-red-700 text-white mb-0 mt-4" @click="accountRemovalHandler = true">Remove</button>
			</template>
		</SectionComponent>

		<MenuComponent :class="{ active: isActive }" v-model="isActive" />
	</main>

	<!-- Popups -->
	<!-- Profile Details Update Popup -->
	<ProfilePopupComponent
		@wheel.prevent
		@touchmove.prevent
		@scroll.prevent
		:class="{ active: profileDetailsHandler }"
		v-model="profileDetailsHandler"
	>
		<template #profile-details-popup>
			<p class="text-base text-center">Profile details has been updated successfully</p>
			<button class="button w-2/5 mt-4 mx-auto mb-0" @click="profileDetailsHandler = false">Close</button>
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
			<div class="inputs-box" :class="{ margin: emailV$.email.$error }">
				<input
					type="email"
					placeholder="Email"
					v-model="emailDetails.email"
					:class="{ empty: emailV$.email.$error }"
					class="inputs"
				/>
				<i class="fa-solid fa-user icons"></i>
			</div>
			<span class="inputs-errors text-center" v-if="emailV$.email.$error">{{ emailV$.email.$errors[0].$message }}</span>
			<div class="flex flex-row justify-evenly">
				<button class="button" @click="closePopup">Close</button>
				<button class="button bg-red-700 text-white" @click="checkEmail">Remove</button>
			</div>
		</template>
	</ProfilePopupComponent>
</template>

<script setup>
//imports
import { ref, reactive, computed } from 'vue'
import { useStoreAuth } from '../stores/storeAuth'
import { getStorage, ref as storageReference, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { required, email, minLength, alpha, sameAs } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import NavbarComponent from '../components/NavbarComponent.vue'
import MenuComponent from '../components/MenuComponent.vue'
import SectionComponent from '../components/SectionComponent.vue'
import ProfilePopupComponent from '../components/ProfilePopupComponent.vue'

//variable handling menu
const isActive = ref(false)

//store
const storeAuth = useStoreAuth()
const photo = computed(() => storeAuth.user.photo)

//handling "Basic Information Section"
const profileDetails = reactive({
	name: storeAuth.user.name,
	surname: storeAuth.user.surname,
	weight: storeAuth.user.weight,
})

//handler of showing popup after successfully updated profile details
const profileDetailsHandler = ref(false)

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
		const storageRef = storageReference(storage, `pictures/${picture.value.name}`)

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
		storeAuth.deleteUser()
		accountRemovalHandler.value = false
	}
}

const closePopup = () => {
	accountRemovalHandler.value = false
	emailDetails.email = ''
}
</script>
