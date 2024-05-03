import type { RequestParams, ResponseData } from '$lib/types';
import { json } from '@sveltejs/kit';

const fetchOfficials = async (address: string): Promise<ResponseData> => {
	const url = 'https://open-states.sultan7rs.workers.dev/officials';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ address })
	});

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return await response.json();
};

export async function POST({ request }) {
	const { zip } = (await request.json()) as { zip: string };
	if (!zip) {
		return json({ error: 'missing zip' }, { status: 400 });
	}
	//params.address = zip;
	const post = await fetchOfficials(zip);

	return json(post);
}
