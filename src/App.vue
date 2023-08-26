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
body {
	font-size: 62.5%;
	background-color: #000000;
	background-image: linear-gradient(147deg, #000000 0%, #04619f 74%);
}


</style>
