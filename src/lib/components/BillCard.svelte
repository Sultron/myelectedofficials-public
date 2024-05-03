<script lang="ts">
	import { UserFriendlyBillMessage } from '$lib/constants';
	import type { Daum } from '$lib/personType/types';

	export let billItem: Daum;

	const state = billItem.session.state.name;
	const stateAbbreviation = billItem.session.state.abbreviation.toLowerCase();
	const status =
		UserFriendlyBillMessage[billItem.status as keyof typeof UserFriendlyBillMessage] ||
		billItem.status;
	const number = billItem.number;
	const name = billItem.name;
	const session = billItem.session.displayName;

	const linkID = billItem.id.split('-').slice(1);

	const billLink = `/bills/${linkID[0]}/${linkID.slice(1).join('-')}`;
	console.log(billLink);
</script>

<div></div>

<div class="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
	<!-- <img
        alt="Blog Post 1"
        class="h-48 w-full object-cover"
        height={400}
        src="/placeholder.svg"
        style="aspect-ratio: 800/400; object-fit: cover;"
        width={800}
    /> -->
	<div class="flex flex-col justify-between p-4">
		<div class="flex justify-between">
			<div>
				<h3 class="text-xl font-bold text-gray-800">{number}</h3>

				<p class="font-semibold text-gray-700 dark:text-gray-400">
					{state}
				</p>
			</div>
			<div>
				<a
					href={billLink}
					class="rounded bg-gray-200 p-2 px-3 uppercase text-gray-500 hover:bg-gray-300 dark:text-gray-400"
				>
					Details
				</a>
			</div>
		</div>
		<div>
			<p class="mt-2 text-lg text-blue-500 dark:text-gray-400">
				{status}
			</p>

			<p class="mt-2 text-gray-700 dark:text-gray-400">
				{name}
			</p>

			<p class="mt-2 text-gray-500 dark:text-gray-400">
				{session}
			</p>
		</div>
	</div>
</div>
