<template>
	<section class="py-8 flex flex-col items-center border-b-2 border-slate-200">
		<slot name="basic-information"></slot>
		<slot name="profile-picture"></slot>
		<slot name="change-password"></slot>
		<slot name="remove-account"></slot>
	</section>
</template>

<script setup></script>
