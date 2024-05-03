import type { AddressDetails } from '$lib/types';
import { json } from '@sveltejs/kit';

// const fetchCityAndState = async (zip: string): Promise<AddressDetails> => {
// 	const formData = new FormData();
// 	formData.append('zip', zip);

// 	const data = await fetch('https://tools.usps.com/tools/app/ziplookup/cityByZip', {
// 		method: 'POST',
// 		body: formData
// 	});

// 	const json = await data.json();
// 	return json as AddressDetails;
// };

const fetchCityAndState = async (zip: string): Promise<AddressDetails> => {
	const data = await fetch(`https://open-states.sultan7rs.workers.dev/city/${zip}`);
	const json = await data.json();
	return json as AddressDetails;
};

export async function POST({ request }) {
	const { zip } = await request.json();

	if (!zip) {
		return json({ error: 'missing zip' }, { status: 400 });
	}
	const post = await fetchCityAndState(zip);

	return json(post);
}
