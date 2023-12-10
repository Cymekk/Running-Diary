<template>
	<header
		class="relative h-[100svh] flex flex-col justify-center items-center bg-[url('../assets/running-small.jpg')] bg-center bg-cover bg-no-repeat"
	>
		<div class="shadow absolute inset-0 bg-black/50"></div>
		<h2 class="text-[32px] font-bold z-20 mb-[24px] text-[#8F9DBF]">Your Running Diary</h2>
		<slot name="login-form"></slot>
	</header>
</template>

<script setup></script>
