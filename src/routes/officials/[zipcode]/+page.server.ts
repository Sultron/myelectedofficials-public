import type { RequestParams, ResponseData } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const fetchOfficials = async (params: RequestParams): Promise<ResponseData> => {
	const url = new URL('https://www.googleapis.com/civicinfo/v2/representatives');
	url.searchParams.append('address', params.address);
	url.searchParams.append('includeOffices', String(params.includeOffices));
	//url.searchParams.append('levels', params.levels.join(','));
	// url.searchParams.append("roles", params.roles.join(","));
	url.searchParams.append('key', params.accessToken);

	const response = await fetch(url.toString());

	if (!response.ok) {
		redirect(302, '/');
	}

	return await response.json();
};

const fetchWikiProfileImage = async (name: string) => {
	const url = new URL('https://en.wikipedia.org/w/api.php');
	name = name.replace(/\s\w\.\s/i, ' ');
	url.searchParams.append('action', 'query');
	url.searchParams.append('format', 'json');
	url.searchParams.append('prop', 'pageimages');
	url.searchParams.append('titles', name);
	url.searchParams.append('pithumbsize', '200');
	url.searchParams.append('origin', '*');

	const response = await fetch(url.toString());
	const json = await response.json();
	const pages = json.query.pages;
	const pageId = Object.keys(pages)[0];
	const page = pages[pageId];
	return page.thumbnail?.source;
};

const checkPhotos = async ({ officials }: ResponseData) => {
	const promises = officials.map(async (official) => {
		//if (official.photoUrl === undefined) {
		let name = official.name;
		if (name === 'Joseph R. Biden') {
			name = 'Joe Biden';
		} else if (name === 'Kamala D. Harris') {
			name = 'Kamala Harris';
		}

		official.photoUrl = await fetchWikiProfileImage(name);
		//}
		return official;
	});

	// Wait for all promises to resolve
	return Promise.all(promises);
};

export const load: PageServerLoad = async ({ params, url }) => {
	const state = url.searchParams.get('state');
	const city = url.searchParams.get('city');
	const { zipcode } = params;
	const address = `${city}, ${state} ${zipcode}`;
	const civicInfoParams: RequestParams = {
		address: address,
		includeOffices: true,
		levels: ['administrativeArea1', 'locality'],
		roles: ['headOfGovernment', 'legislatorUpperBody'],
		accessToken: '***REMOVED***'
	};

	const officials = await fetchOfficials(civicInfoParams);
	officials.officials = await checkPhotos(officials);
	return { officials };
	//return await fetchOfficials(civicInfoParams);
};
