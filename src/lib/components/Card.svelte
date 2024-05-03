<script lang="ts">
	import type { Office, Official } from '$lib/types';
	import { fetchPlus, getProfileURL } from '$lib/utils';
	import SvelteMarkdown from 'svelte-markdown';

	let flipped = false;

	export let office: Office;

	export let official: Official;

	let summary = '';
	let streamClosed = false;
	let typingAnimationFinished = false;

	let subHeadingCardText = '';

	const startCharacterByCharacterSubHeading = () => {
		typingAnimationFinished = false;
		subHeadingCardText = '';
		const text = "Retrieving and summarizing the official's latest bio...";
		let i = 0;
		const interval = setInterval(() => {
			if (i < text.length) {
				subHeadingCardText += text[i];
				i++;
			} else {
				typingAnimationFinished = true;
				clearInterval(interval);
			}
		}, 50);
	};

	const fetchOfficialSummary = async (name: string) => {
		typingAnimationFinished = true;
		startCharacterByCharacterSubHeading();

		// const response = await fetch('../api/summary', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ name })
		// });

		const response = await fetchPlus(
			'/api/summary',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name })
			},
			3
		);
		// stream the response
		const reader = response.body?.getReader();

		streamClosed = false;
		const stream = new ReadableStream({
			start(controller) {
				// The following function handles each data chunk
				function push() {
					// "done" is a Boolean and value a "Uint8Array"
					reader?.read().then(({ done, value }) => {
						// If there is no more data to read
						if (done) {
							controller.close();
							return;
						}
						// Get the data and send it to the browser via the controller
						controller.enqueue(value);
						push();
					});
				}
				push();
			}
		});

		// Respond with our stream
		const readableStream = stream.pipeThrough(new TextDecoderStream()).pipeTo(
			new WritableStream({
				write(chunk) {
					console.log('Chunk:', chunk);
					try {
						summary += JSON.parse(chunk);
					} catch (error) {
						console.error('Error parsing JSON:', error);
					}
				},
				close() {
					console.log('Stream closed');
					streamClosed = true;
				}
			})
		);
	};

	$: flipped && fetchOfficialSummary(official.name);
</script>

<div class:flipped class="w-full">
	<div class="flip-card flex h-96 flex-col justify-between rounded border p-2">
		<div class="flip-card-inner">
			<div class="card__corner relative z-10">
				<p class="absolute text-xs">see</p>
				<button class="card__corner-triangle relative shadow" on:click={() => (flipped = !flipped)}>
					<p class="absolute text-xs tracking-tight"></p>
				</button>
			</div>

			<div class="flip-card-front">
				<div class="flex h-full flex-col justify-between">
					<div class="px-10">
						<h2 class="text-center text-xl font-medium">{office.name}</h2>
						<h3 class="py-1 text-center text-lg">
							{official.name}
							{#if official.party === 'Democratic Party'}
								<span class="rounded-full bg-blue-500 p-1 px-2 text-xl font-semibold text-white"
									>{official.party[0]}</span
								>
							{/if}
							{#if official.party === 'Republican Party'}
								<span class="rounded-full bg-red-500 p-1 px-2 text-xl font-semibold text-white"
									>{official.party[0]}</span
								>
							{/if}
							<!-- <span
                        class="rounded-full p-1 px-2 text-xl font-semibold text-white"
                        class:bg-blue-500={official.party === 'Democratic Party'}
                        class:bg-red-500={official.party === 'Republican Party'}>{official.party[0]}</span
                    > -->
						</h3>

						{#if official.photoUrl}
							<img
								src={official.photoUrl}
								alt={official.name}
								class="mx-auto h-40 max-w-full rounded-full border-none object-contain align-middle shadow"
							/>
						{:else}
							<div
								class="mx-auto flex h-40 w-28 items-center justify-center rounded-full bg-gray-300"
							>
								<p class="text-2xl font-semibold text-gray-500">
									{official.name[0]}
								</p>
							</div>
						{/if}

						<!-- <p
                 class="text-center"
                 class:text-blue-500={official.party === 'Democratic Party'}
                 class:text-red-500={official.party === 'Republican Party'}
                 class:text-green-500={official.party === 'Nonpartisan'}
                 >
                 {official.party}
                 </p> -->

						<div>
							{#if official.channels}
								<div class="flex justify-center gap-5 py-2">
									{#each official.channels as channel}
										<a
											href={getProfileURL(channel.type, channel.id)}
											target="_blank"
											rel="noopener noreferrer"
											class="text-blue-500 hover:text-blue-700"
										>
											<!-- {channel.id} -->
											<iconify-icon icon="devicon:{channel.type.toLowerCase()}" class="text-2xl"
											></iconify-icon>
										</a>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<div class="py-1 text-center">
						<a
							class="flex items-center justify-center"
							href="tel:{official.phones[0]
								.replaceAll('(', '')
								.replaceAll(')', '')
								.replaceAll(' ', '')
								.replaceAll('-', '')}"
						>
							<iconify-icon icon="bi:phone-fill" class="text-gray-600"></iconify-icon><span
								class="text-gray-900">{official.phones}</span
							>
						</a>

						{#if official.emails}
							<a
								href={`mailto:${official.emails}`}
								class="flex items-center justify-center gap-1 overflow-hidden text-ellipsis text-blue-500 hover:text-blue-700"
							>
								<iconify-icon icon="ic:round-email" /><span>{official.emails}</span>
							</a>
						{/if}
						{#if official.urls}
							<a
								href={official.urls[0]}
								target="_blank"
								class="flex items-center justify-center gap-1 overflow-hidden text-ellipsis text-blue-500 hover:text-blue-700"
								><iconify-icon icon="ion:globe-outline" /><span class="overflow-hidden truncate"
									>Homepage</span
								></a
							>
						{/if}
					</div>
				</div>
			</div>
			<div class="flip-card-back flex flex-col gap-2 overflow-y-auto px-7 py-8">
				<h2 class="text-center text-xl font-medium">{official.name}</h2>
				<p class="text-sm {summary ? 'hidden' : 'block'}">
					{subHeadingCardText}<span
						class="animate-pulse rounded-full bg-gray-600 px-2 {typingAnimationFinished
							? 'hidden'
							: ''}"
					/>
				</p>
				<div class="flex flex-col gap-2">
					<SvelteMarkdown source={summary} />
					<div>
						<span
							class="ml-0.5 animate-pulse rounded-full bg-gray-600 px-2 {streamClosed ||
							!typingAnimationFinished
								? 'hidden'
								: ''}"
						/>
					</div>
				</div>
			</div>
		</div>
		<!-- <button class:flipped on:click={() => (flipped = !flipped)}>
			{flipped ? 'View front' : 'View back'}
		</button> -->
	</div>
</div>

<style>
	/* Flip card toggle */
	.flip-card {
		background-color: transparent;
		perspective: 1000px;
	}

	.flip-card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.6s;
		transform-style: preserve-3d;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	}

	.flipped .flip-card .flip-card-inner {
		transform: rotateY(-180deg);
	}

	.flip-card-front,
	.flip-card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.flip-card-back {
		background-color: transparent;
		transform: rotateY(180deg);
	}

	.card__corner {
		position: absolute;
		top: 0;
		right: 0;
		width: 1.8em;
		height: 1.8em;
		background-color: transparent;
	}

	.card__corner .card__corner-triangle {
		position: absolute;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 1.8em 1.8em 0;
		border-radius: 10%;
		border-color: transparent transparent #d1d5db transparent;
	}

	.card__corner p {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: rotate(45deg) translate(-60%, -35%);
	}

	.flipped .card__corner p {
		transform: rotate(45deg) rotateY(180deg) translate(60%, -35%);
	}

	.card__corner .card__corner-triangle:hover {
		border-color: transparent transparent #2563eb transparent;
		color: white;
	}

	.card__corner .card__corner-triangle p {
		transform: rotate(45deg) translate(50%, 45%);
	}
	.card__corner .card__corner-triangle p:before {
		transform: rotate(45deg) translate(50%, 45%);
		content: 'bio';
	}

	.flipped .card__corner .card__corner-triangle p {
		transform: rotate(45deg) rotateY(180deg) translate(-40%, 45%);
	}
	.flipped .card__corner .card__corner-triangle p:before {
		content: 'info';
	}

	.typed-out {
		overflow: hidden;
		animation:
			typing 5s steps(50, end) forwards,
			blinking 1.2s infinite;
		border-right: 2px solid orange; /* To create the typing cursor effect */
		white-space: nowrap; /* Allow text to wrap onto multiple lines */
	}
	@keyframes typing {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}
	@keyframes blinking {
		50% {
			border-color: transparent; /* Hide the cursor in the middle of animation */
		}
	}
</style>
