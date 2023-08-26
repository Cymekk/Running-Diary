<template>
	<div class="shadow">
		<main class="body">
			<h3 class="title">OOOPS...</h3>
			<p class="text">
				You didn't added your body weight, please add it now for correct calculation burned calories during training.
			</p>

			<div class="input-box">
				<input type="number" placeholder="Weight" />
				<i class="fa-solid fa-weight-hanging"></i>
			</div>

			<button class="button save-btn">Save</button>
		</main>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
@import '../scss/button.scss';
.shadow {
	position: fixed;
	top: 0;
	left: 0;

	width: 100%;
	height: 100svh;

	background-color: rgba(0, 0, 0, 0.6);

	.body {
		display: flex;
		flex-direction: column;
		align-items: center;

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		padding: 1rem;

		width: 80%;
		max-width: 400px;
		min-height: 10svh;

		background-color: #ddd;
		border-radius: 10px;

		.title {
			font-size: 1.2rem;
		}

		.text {
			margin: 1rem 0;
			font-size: 1rem;
		}

		.input-box {
			position: relative;

			width: 100%;

			input {
				width: 100%;

				padding: 0.5rem;

				text-align: center;

				border: none;
				border-radius: 10px;
				outline: none;
			}

			i {
				position: absolute;
				top: 50%;
				left: 5px;

				transform: translateY(-50%);

				font-size: 1rem;
			}
		}

		.save-btn {
			margin-top: 1rem;
			background-color: var(--button-primary-color);
		}
	}
}
</style>
