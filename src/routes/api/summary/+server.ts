import type { RequestParams, ResponseData } from '$lib/types';
import { json } from '@sveltejs/kit';
import { VertexAI } from '@google-cloud/vertexai';

const fetchOfficialElectedWikiPage = async (name: string): Promise<ResponseData> => {
	if (name === 'Joseph R. Biden') {
		name = 'Joe Biden';
	} else if (name === 'Kamala D. Harris') {
		name = 'Kamala Harris';
	}
	const url = new URL('https://en.wikipedia.org/w/api.php');
	url.searchParams.append('action', 'query');
	url.searchParams.append('format', 'json');
	url.searchParams.append('prop', 'extracts');
	url.searchParams.append('titles', name);
	url.searchParams.append('exintro', '1');
	url.searchParams.append('explaintext', '1');
	url.searchParams.append('origin', '*');
	const response = await fetch(url.toString());
	const json = await response.json();
	const pages = json.query.pages;
	const pageId = Object.keys(pages)[0];
	const page = pages[pageId];
	return page.extract;
};
const generateOfficialSummary = async (name: string) => {
	// Initialize Vertex with your Cloud project and location
	const vertex_ai = new VertexAI({ project: 'myelectedofficials-415909', location: 'us-central1' });
	const model = 'gemini-1.5-pro-preview-0409';
	//gemini-1.0-pro-001

	// fetch the wikipedia page for the elected official
	const wikiPage = await fetchOfficialElectedWikiPage(name);

	// Instantiate the models
	const generativeModel = vertex_ai.preview.getGenerativeModel({
		model: model,
		generationConfig: {
			maxOutputTokens: 768,
			temperature: 0.2,
			topP: 0.8,
			topK: 40
		}
	});

	const text1 = {
		text: `Provide a brief summary for the following article:

${wikiPage}`
	};

	async function generateContent() {
		const req = {
			contents: [{ role: 'user', parts: [text1] }]
		};

		const streamingResp = await generativeModel.generateContentStream(req);

		const readable = new ReadableStream({
			async start(controller) {
				for await (const item of streamingResp.stream) {
					controller.enqueue(item);
				}
				controller.close();
			}
		});

		for await (const item of streamingResp.stream) {
			process.stdout.write('stream chunk: ' + JSON.stringify(item) + '\n');
		}

		process.stdout.write('aggregated response: ' + JSON.stringify(await streamingResp.response));
	}

	generateContent();
};

export async function POST({ request }) {
	const { name } = await request.json();
	if (!name) {
		return json({ error: 'missing name' }, { status: 400 });
	}
	const vertex_ai = new VertexAI({ project: 'myelectedofficials-415909', location: 'us-central1' });
	const model = 'gemini-1.5-pro-preview-0409';
	//gemini-1.0-pro-001

	// fetch the wikipedia page for the elected official
	const wikiPage = await fetchOfficialElectedWikiPage(name);

	// Instantiate the models
	const generativeModel = vertex_ai.preview.getGenerativeModel({
		model: model,
		generationConfig: {
			maxOutputTokens: 768,
			temperature: 0.2,
			topP: 0.8,
			topK: 40
		}
	});

	const text1 = {
		text: `Provide a brief summary for the following article:

${wikiPage}`
	};

	const req = {
		contents: [{ role: 'user', parts: [text1] }]
	};

	const streamingResp = await generativeModel.generateContentStream(req);
	// Prepare the response headers
	const headers = {
		'Content-Type': 'application/json'
	};
	const encoder = new TextEncoder();
	const readable = new ReadableStream({
		async start(controller) {
			for await (const item of streamingResp.stream) {
				controller.enqueue(
					encoder.encode(
						JSON.stringify(
							item.candidates?.map((c) => c.content.parts.flatMap((p) => p.text).join(' ') ?? '')
						)
					)
				);
			}
			controller.close();
		}
	});

	return new Response(readable, { headers });
}
