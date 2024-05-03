import type { PageServerLoad } from './$types';
import type { OfficialInfo } from './types';

export const load: PageServerLoad = async ({ params, url }) => {
	const { id } = params;

	const response = await fetch(`https://open-states.sultan7rs.workers.dev/person/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const OfficialInfo = (await response.json()) as OfficialInfo;

	return OfficialInfo;
};
