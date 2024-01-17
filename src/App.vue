<template>
	<RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useStoreAuth } from './stores/storeAuth'

const storeAuth = useStoreAuth()

onMounted(() => {
	storeAuth.init()
})
</script>

<style>
input[type='date']::-webkit-calendar-picker-indicator {
	background-color: #b8c1d9;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

</style>
