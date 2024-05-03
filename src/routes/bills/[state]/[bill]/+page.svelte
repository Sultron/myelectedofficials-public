<script lang="ts">
	import { page } from '$app/stores';
	import 'iconify-icon';

	import { stateAbbreviationToFull } from '../constants';
	import { fetchPlus } from '$lib/utils';

	import TypingText from '$lib/components/TypingText.svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import { UserFriendlyBillMessage } from '$lib/constants';

	const state =
		stateAbbreviationToFull[
			$page.params.state.toUpperCase() as keyof typeof stateAbbreviationToFull
		];
	export let data;

	let billSummary = '';

	let billDifferences = '';

	let billTopics = '';

	let typingAnimationFinished = true;

	let isSummaryGenerating = false;
	let isDifferencesGenerating = false;
	let isTopicsGenerating = false;

	let showVerticalDotsDropdownMenu = false;

	let fromVersionToVersionDoucment = {
		fromVersion: data.versions[0].id,
		toVersion: data.versions[0].id
	};

	let errorMessage = '';

	let selectedVersion = data.versions[0].id;

	let sourceDocUrl = data.versions[0].sourceDocUrl;

	let billStatusMessage =
		UserFriendlyBillMessage[data.status.toLowerCase() as keyof typeof UserFriendlyBillMessage];

	const onSelectedVersionChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		selectedVersion =
			data.versions.find((version) => version.id === Number(target.value))?.id ||
			data.versions[0].id;

		sourceDocUrl =
			data.versions.find((version) => version.id === Number(target.value))?.sourceDocUrl ||
			data.versions[0].sourceDocUrl;
	};

	const handleDropdownFocusLoss = (event: FocusEvent) => {
		const { relatedTarget, currentTarget } = event;
		// Use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		if (
			relatedTarget instanceof HTMLElement &&
			currentTarget instanceof HTMLElement &&
			currentTarget.contains(relatedTarget)
		)
			return; // Check if the new focus target doesn't exist in the dropdown tree (exclude ul/li padding area because relatedTarget, in this case, will be null)
		showVerticalDotsDropdownMenu = false;
	};

	const onShareButtonClick = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Bill Summary',
					text: data.name,
					url: window.location.href
				});
			} catch (error) {
				console.error('Error sharing:', error);
			}
		}
	};

	const fetchBillTopics = async () => {
		const billDocument = data.versions.find((version) => version.id === selectedVersion)?.baseText;

		isTopicsGenerating = true;
		typingAnimationFinished = false;
		const response = await fetchPlus(
			'/api/bills/topics',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ billDocument })
			},
			3
		);
		// const response = await fetch(`/api/bills/topics`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ billId })
		// });

		// stream the response
		const reader = response.body?.getReader();

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
					try {
						billTopics += JSON.parse(chunk).join();
					} catch (error) {
						console.error('Error parsing JSON:', error);
					}
				},
				close() {
					console.log('Stream closed');
					isTopicsGenerating = false;
				}
			})
		);
	};

	const fetchBillDifferences = async () => {
		errorMessage = '';
		if (fromVersionToVersionDoucment.fromVersion === fromVersionToVersionDoucment.toVersion) {
			errorMessage = 'Please select different versions to compare.';
			return;
		}
		isDifferencesGenerating = true;
		typingAnimationFinished = false;
		const response = await fetchPlus(
			'/api/bills/differences',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fromVersion: data.versions.find(
						(version) => version.id === fromVersionToVersionDoucment.fromVersion
					)?.baseText,
					toVersion: data.versions.find(
						(version) => version.id === fromVersionToVersionDoucment.toVersion
					)?.baseText
				})
			},
			3
		);
		// const response = await fetch(`/api/bills/differences`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify(fromVersionToVersionDoucment)
		// });
		// stream the response
		const reader = response.body?.getReader();

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
					try {
						billDifferences += JSON.parse(chunk).join();
					} catch (error) {
						console.error('Error parsing JSON:', error);
					}
				},
				close() {
					console.log('Stream closed');
					isDifferencesGenerating = false;
				}
			})
		);
	};

	const fetchBillSummary = async (billId: string) => {
		isSummaryGenerating = true;
		typingAnimationFinished = false;
		//startCharacterByCharacterSubHeading();
		//const billId = new URL(url).pathname;
		const response = await fetchPlus(
			'/api/bills/summary',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ billId })
			},
			3
		);
		// const response = await fetch(`/api/bills/summary`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ billId })
		// });
		// stream the response
		const reader = response.body?.getReader();

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
					try {
						billSummary += JSON.parse(chunk).join();
					} catch (error) {
						console.error('Error parsing JSON:', error);
					}
				},
				close() {
					console.log('Stream closed');
					isSummaryGenerating = false;
				}
			})
		);
	};
</script>

<div class="container mx-auto max-w-7xl py-20 sm:px-6 lg:px-8">
	<!-- <h1 class="text-center text-3xl font-bold tracking-tighter sm:text-5xl">
		Bill {data.number} Details
	</h1> -->
	<div class="flex flex-col items-start gap-8 lg:flex-row">
		<div class="flex-1 rounded-lg bg-white p-6 shadow">
			<div class="flex items-start justify-between border-b pb-4">
				<div>
					<p class="text-sm font-semibold uppercase">{state} - {data.session.displayName}</p>
					<h1 class="text-xl font-bold">
						{data.number}
					</h1>
				</div>
				<div class="flex items-center space-x-2">
					<button
						on:click={onShareButtonClick}
						class="flex items-center rounded-full bg-gray-100 px-3 py-1 text-gray-800 hover:ring-2 hover:ring-gray-300 active:ring-gray-500"
						><iconify-icon icon="ri:share-fill"></iconify-icon>SHARE</button
					>
					<div class="relative" on:focusout={handleDropdownFocusLoss}>
						<button
							class="flex items-center rounded p-1 text-lg hover:bg-gray-100 hover:ring-2 hover:ring-gray-300 active:ring-gray-500"
							on:click={() => (showVerticalDotsDropdownMenu = !showVerticalDotsDropdownMenu)}
						>
							<iconify-icon icon="radix-icons:dots-vertical"></iconify-icon>
						</button>
						<div
							class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
							class:hidden={!showVerticalDotsDropdownMenu}
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="menu-button"
							tabindex="-1"
						>
							<div class="py-1" role="none">
								<!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
								<a
									href={sourceDocUrl}
									class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
									tabindex="-1"
									id="menu-item-0"
									target="_blank"
								>
									<svg
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
										/>
									</svg>

									View PDF
								</a>
							</div>
							<div class="py-1" role="none">
								<a
									href={data.sourceUrl}
									class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
									tabindex="-1"
									id="menu-item-1"
									target="_blank"
								>
									<svg
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
										/>
									</svg>

									View Source
								</a>
							</div>

							<div class="py-1" role="none">
								<a
									href="#"
									class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
									tabindex="-1"
									id="menu-item-3"
								>
									<svg
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
										/>
									</svg>

									Print
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="pt-4">
				<button class="mb-4"> Add Bill Tags</button>
				<div class="mb-4 flex items-center justify-between rounded bg-gray-100 p-4">
					<div class="flex items-center gap-2">
						<label for="location" class="block text-sm font-medium leading-6 text-gray-900"
							>Document:</label
						>
						<select
							id="location"
							name="location"
							class="block w-full max-w-48 rounded-md border-0 p-1.5 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
							bind:value={selectedVersion}
							on:change={onSelectedVersionChange}
						>
							{#each data.versions as version}
								<option value={version.id}>{version.versionName}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="rounded-md border-l-8 px-5 py-2 text-sm">
					<p class="leading-loose">
						{data.versions.find((version) => version.id === selectedVersion)?.baseText}
					</p>
				</div>
			</div>
		</div>
		<div class="flex-1 rounded-lg bg-white p-6 shadow">
			<div>
				<div class="space-y-4">
					<div class="border-b pb-4">
						<h2 class="text-lg font-semibold">Bill Details</h2>
						<div class="py-3">
							<h3 class="font-semibold">Title</h3>
							<p class="mt-1 text-gray-500">
								{data.name}
							</p>
						</div>
					</div>
					<div class="border-b pb-4">
						<div class="rounded bg-gray-100 p-4">
							<h2 class="pb-2 text-2xl font-semibold">
								Gen AI
								<span class="inline text-xs font-medium text-gray-500"
									>powered by
									<iconify-icon icon="logos:google-gemini" class="text-xl" aria-label="gemini" />
								</span>
							</h2>
							<div class="space-y-4">
								<div class="relative flex items-center gap-2">
									<h2 class="text-xl font-semibold">Topics</h2>
									<div class="group mt-1 w-fit text-lg text-gray-500">
										<iconify-icon icon="lucide:info"></iconify-icon>
										<span
											class="pointer-events-none absolute left-0 top-7 z-10 w-max max-w-md rounded bg-gray-700 px-2 py-1 text-sm font-medium text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100"
										>
											We use Gemini AI to analyze the content of bills, effectively identifying and
											categorizing their key themes and subjects. Although AI is powerful, it's
											vital to acknowledge its potential for errors. Hence, implementing validation
											procedures is crucial to ensure the accuracy of important information.
										</span>
									</div>
								</div>
								{#if billTopics.length === 0}
									<button
										class="flex items-center gap-1 rounded-full bg-blue-400 px-2 py-1 text-sm text-white"
										on:click={fetchBillTopics}
										>Generate
									</button>
								{/if}
								<TypingText
									class="text-sm {billTopics ? 'hidden' : ''}"
									text="Detecting bill {data.number} topics..."
									onTypingEnd={() => {
										typingAnimationFinished = true;
									}}
									shouldStart={isTopicsGenerating && !billTopics}
									cursorDelay={500}
								/>
								<div class="flex flex-col gap-2" class:hidden={!isTopicsGenerating && !billTopics}>
									<SvelteMarkdown source={billTopics} />
									<div>
										<span
											class="ml-0.5 animate-pulse rounded-full bg-gray-600 px-2 {isTopicsGenerating &&
											typingAnimationFinished
												? ''
												: 'hidden'}"
										/>
									</div>
								</div>

								<div class="relative flex items-center gap-2">
									<h2 class="text-xl font-semibold">Bill Summary</h2>
									<div class="group mt-1 w-fit text-lg text-gray-500">
										<iconify-icon icon="lucide:info"></iconify-icon>
										<span
											class="pointer-events-none absolute left-0 top-7 z-10 w-max max-w-md rounded bg-gray-700 px-2 py-1 text-sm font-medium text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100"
										>
											We use Gemini AI to carefully examine new versions of bills and create short
											summaries of the proposed changes. Although AI is powerful, it's vital to
											acknowledge its potential for errors. Hence, implementing validation
											procedures is crucial to ensure the accuracy of important information.
										</span>
									</div>
								</div>

								{#if billSummary.length === 0}
									<button
										class="flex items-center gap-1 rounded-full bg-blue-400 px-2 py-1 text-sm text-white"
										on:click={() => fetchBillSummary(data.id)}
										>Generate
									</button>
								{/if}

								<TypingText
									class="text-sm {billSummary ? 'hidden' : ''}"
									text="Summarizing bill {data.number}..."
									onTypingEnd={() => {
										typingAnimationFinished = true;
									}}
									shouldStart={isSummaryGenerating && !billSummary}
									cursorDelay={500}
								/>

								<!-- <TypingText
									class="text-sm"
									bind:text={billSummary}
									onTypingEnd={() => console.log('done')}
									shouldStart={isGenerating && typingAnimationFinished && billSummary.length > 0}
								/> -->

								<!-- <p class="text-sm">
									{billSummary}<span
										class="ml-0.5 animate-pulse rounded-full bg-gray-600 px-2 {isSummaryGenerating &&
										typingAnimationFinished
											? ''
											: 'hidden'}"
									/>
								</p> -->
								<div
									class="flex flex-col gap-2"
									class:hidden={!isSummaryGenerating && !billSummary}
								>
									<SvelteMarkdown source={billSummary} />
									<div>
										<span
											class="ml-0.5 animate-pulse rounded-full bg-gray-600 px-2 {isSummaryGenerating &&
											typingAnimationFinished
												? ''
												: 'hidden'}"
										/>
									</div>
								</div>

								<!-- <TypingText class="text-sm" bind:text={billSummary} bind:isGenerating /> -->
								{#if data.versions.length > 1}
									<div class="relative flex items-center gap-2">
										<h2 class="text-xl font-semibold">Compare Versions</h2>
										<div class="group mt-1 w-fit text-lg text-gray-500">
											<iconify-icon icon="lucide:info"></iconify-icon>
											<span
												class="pointer-events-none absolute left-0 top-7 z-10 w-max max-w-md rounded bg-gray-700 px-2 py-1 text-sm font-medium text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100"
											>
												We use Gemini AI to carefully examine two versions of bills and create a
												summary of the key differenes. Although AI is powerful, it's vital to
												acknowledge its potential for errors. Hence, implementing validation
												procedures is crucial to ensure the accuracy of important information.
											</span>
										</div>
									</div>
									<div class="flex items-center gap-4">
										<select
											id="location"
											name="location"
											class="block w-full max-w-40 rounded-md border-0 p-1.5 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
											bind:value={fromVersionToVersionDoucment.fromVersion}
										>
											{#each data.versions as version}
												<option value={version.id}>{version.versionName}</option>
											{/each}
										</select>
										<p class="text-sm text-gray-700">to</p>
										<select
											id="location"
											name="location"
											class="block w-full max-w-40 rounded-md border-0 p-1.5 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
											bind:value={fromVersionToVersionDoucment.toVersion}
										>
											{#each data.versions as version}
												<option value={version.id}>{version.versionName}</option>
											{/each}
										</select>

										<button
											class="rounded-full bg-blue-400 px-2 py-1 text-sm text-white"
											on:click={fetchBillDifferences}>Generate</button
										>
									</div>
									<p class="text-sm text-red-600">{errorMessage}</p>
									<TypingText
										class="text-sm {billDifferences ? 'hidden' : ''}"
										text="Comparing bill version '{data.versions.find(
											(version) => version.id === fromVersionToVersionDoucment.fromVersion
										)?.versionName}' to '{data.versions.find(
											(version) => version.id === fromVersionToVersionDoucment.toVersion
										)?.versionName}'..."
										onTypingEnd={() => {
											typingAnimationFinished = true;
										}}
										shouldStart={isDifferencesGenerating && !billDifferences}
										cursorDelay={1500}
									/>
									<div class="flex flex-col gap-2">
										<SvelteMarkdown source={billDifferences} />
										<div>
											<span
												class="ml-0.5 animate-pulse rounded-full bg-gray-600 px-2 {isDifferencesGenerating &&
												typingAnimationFinished
													? ''
													: 'hidden'}"
											/>
										</div>
									</div>

									<!-- <p class="text-sm">
										{billDifferences}<span
											class="ml-0.5 animate-pulse rounded-full bg-gray-600 px-2 {isDifferencesGenerating &&
											typingAnimationFinished
												? ''
												: 'hidden'}"
										/>
									</p> -->
								{/if}
							</div>
						</div>
					</div>
					<div>
						<div class="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<h3 class="text-lg font-semibold">Bill Status</h3>

								<p class="text-sm text-gray-700">
									{billStatusMessage ? billStatusMessage : data.status}
								</p>
							</div>
							<div>
								<h3 class="text-lg font-semibold">Lastest Action</h3>
								<p class="text-sm text-gray-700">
									{new Date(data.actions[0].actionDate).toLocaleDateString()}
								</p>
							</div>
						</div>

						<h3 class="text-lg font-semibold">Primary Authors</h3>
						<div class="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
							{#each data.sponsors.filter((sponsor) => sponsor.isPrimary) as sponsor}
								<div class="flex items-center gap-1">
									{#if sponsor.person && sponsor.person.imageUrl}
										<img
											alt="Sponsor"
											class="h-16 w-16 rounded-full object-cover"
											src={sponsor.person?.imageUrl}
										/>
									{:else}
										<div
											class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300"
										>
											<p class="text-2xl font-semibold text-gray-500">
												{sponsor.name[0]}
											</p>
										</div>
									{/if}
									{#if sponsor.person && sponsor.person.electedPositions[0]}
										<div
											class="mb-16 flex h-8 w-8 items-center justify-center rounded-full"
											class:bg-blue-500={sponsor.person.electedPositions[0].party[0] === 'D'}
											class:bg-red-500={sponsor.person.electedPositions[0].party[0] === 'R'}
										>
											<span class="p-1 px-2 text-xl font-semibold text-white"
												>{sponsor.person.electedPositions[0].party[0]}</span
											>
										</div>
									{/if}
									<!-- <p class="text-sm">{sponsor.name}</p> -->
									<a href="/officials/person/{sponsor.personId}" class="text-sm text-blue-500"
										>{sponsor.name}</a
									>
								</div>
							{/each}
						</div>
						{#if data.sponsors.filter((sponsor) => !sponsor.isPrimary).length > 0}
							<h3 class="text-lg font-semibold">Co-sponsors</h3>
							<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
								{#each data.sponsors.filter((sponsor) => !sponsor.isPrimary) as sponsor}
									<div class="flex items-center">
										{#if sponsor.person && sponsor.person.imageUrl}
											<img
												alt="Sponsor"
												class="h-16 w-16 rounded-full object-cover"
												src={sponsor.person?.imageUrl}
											/>
										{:else}
											<div
												class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300"
											>
												<p class="text-2xl font-semibold text-gray-500">
													{sponsor.name[0]}
												</p>
											</div>
										{/if}
										{#if sponsor.person && sponsor.person.electedPositions[0]}
											<div
												class="mb-16 flex h-8 w-8 items-center justify-center rounded-full"
												class:bg-blue-500={sponsor.person.electedPositions[0].party[0] === 'D'}
												class:bg-red-500={sponsor.person.electedPositions[0].party[0] === 'R'}
											>
												<span class="p-1 px-2 text-xl font-semibold text-white"
													>{sponsor.person.electedPositions[0].party[0]}</span
												>
											</div>
										{:else}
											<div
												class="mb-16 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300"
											>
												<!-- <p class="text-2xl font-semibold text-gray-500">
												{sponsor.name[0]}
											</p> -->
											</div>
										{/if}
										<!-- <p class="text-sm">{sponsor.name}</p> -->
										<a href="/officials/person/{sponsor.personId}" class="text-sm text-blue-500"
											>{sponsor.name}</a
										>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
