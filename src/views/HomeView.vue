<template>
	<main class="main">
		<NavbarComponent v-if="storeAuth.loaded" v-model="isActive">
			<template #home>
				<RouterLink to="profile-page"
					><button
						class="profile-img"
						v-if="storeAuth.user.photo"
						:style="{ backgroundImage: `url(${storeAuth.user.photo})` }"
					></button
					><button
						class="profile-btn"
						v-if="!storeAuth.user.photo"
					></button
				></RouterLink>
				<h2 class="text-white font-bold text-3xl">Running Diary</h2>
			</template>
		</NavbarComponent>

		<div class="box">
			<button class="button">Add running note</button>
			<span class="text-base text-white" v-if="!runningNotes.length"
				>Didn't added any running notes yet. Do it now.</span
			>
		</div>
	</main>

	<LoaderComponent v-if="!storeAuth.loaded" />
	<MenuComponent :class="{ active: isActive }" v-model="isActive" />
</template>

<script setup>
//imports
import { computed, onMounted, ref } from 'vue'
import { useStoreAuth } from '../stores/storeAuth'
import { useStoreNotes } from '../stores/storeNotes'
import MenuComponent from '../components/MenuComponent.vue'
import NavbarComponent from '../components/NavbarComponent.vue'
import LoaderComponent from '../components/LoaderComponent.vue'
import NoWeightAddedPopupComponent from '../components/NoWeightAddedPopupComponent.vue'

//stores
const storeAuth = useStoreAuth()
const storeNotes = useStoreNotes()

//init Store Auth on Mounted
onMounted(() => {
	storeAuth.init()
})

//variable to handling menu
const isActive = ref(false)

//notes from storeNotes

const runningNotes = computed(() => {
	return storeNotes.notes
})
</script>

<style lang="scss" scoped>
.main {
	padding: 0 2rem;
	min-height: 100svh;

	.profile-img {
		width: 40px;
		height: 40px;

		color: #fff;
		border: 2px solid #fff;
		border-radius: 50%;

		background: none;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;

		img {
			width: 100%;
		}
	}

	.box {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}
</style>
