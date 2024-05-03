import { json } from '@sveltejs/kit';
import type { BillsData } from '../../bills/[state]/types';

export async function POST({ request }) {
	const { state, page, query } = await request.json();
	if (!state) {
		return json({ error: 'missing state' }, { status: 400 });
	}
	const queryParam = query ? `&query=${query}` : '';
	const apiurl = `https://open-states.sultan7rs.workers.dev/bills/${state}?page=${page}${queryParam}`;
	const response = await fetch(apiurl);
	const data = (await response.json()) as BillsData;

	return json(data);
}
