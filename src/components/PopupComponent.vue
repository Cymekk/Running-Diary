<template>
	<header
		class="header after:content-['*'] after:absolute after:top-0 after:left-0 after:w-full after:h-screen after:bg-dark-rgba after:z-10"
	>
		<h2 class="my-4 text-white text-2xl font-bold z-20">Your Running Diary</h2>

		<slot name="login-form"></slot>
	</header>
</template>

<script setup></script>

