<!-- TypingText.svelte -->
<script lang="ts">
	// import Typewriter from 'svelte-typewriter';
	export let text: string;
	export let typingSpeed = 50;
	export let onTypingEnd: () => void;
	export let shouldStart = false;
	export let cursorDelay = 2000;
	let isTypingAnimationFinished = true;
	let animatingText = '';

	const startCharacterByCharacter = () => {
		isTypingAnimationFinished = false;
		let i = 0;
		const interval = setInterval(() => {
			if (i < text.length) {
				animatingText += text[i];
				i++;
			} else {
				console.log('Typing animation finished');
				setTimeout(() => {
					isTypingAnimationFinished = true;
					onTypingEnd();
				}, cursorDelay);
				clearInterval(interval);

				// isTypingAnimationFinished = true;
				// clearInterval(interval);
				// onTypingEnd();

				//onTypingEnd();
			}
		}, typingSpeed);
	};

	$: {
		if (shouldStart) {
			startCharacterByCharacter();
		}
	}
</script>

<p class={$$restProps.class || ''}>
	{animatingText}<span
		class="ml-0.5 animate-pulse rounded-full bg-gray-600 px-2 {isTypingAnimationFinished
			? 'hidden'
			: ''}"
	/>
</p>
