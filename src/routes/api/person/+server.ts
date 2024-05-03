import { json } from '@sveltejs/kit';
import type { SponsoredBills } from '../../../lib/personType/types';

export async function POST({ request }) {
	const { id, offset } = await request.json();
	if (!id) {
		return json({ error: 'missing id' }, { status: 400 });
	}

	const apiurl = `https://open-states.sultan7rs.workers.dev/sponsored-bills/${id}?offset=${offset ? offset : 0}`;
	const response = await fetch(apiurl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = (await response.json()) as SponsoredBills;

	return json(data);
}
