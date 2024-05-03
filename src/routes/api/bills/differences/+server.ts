import { json } from '@sveltejs/kit';
import { VertexAI } from '@google-cloud/vertexai';

export async function POST({ request }) {
	const { fromVersion, toVersion } = await request.json();

	if (!fromVersion || !toVersion) {
		return json({ error: 'missing version1 or version2 document' }, { status: 400 });
	}
	//const apiurl = `https://open-states.sultan7rs.workers.dev/bills/${state}?page=${page}`;
	//const response = await fetch(apiurl);
	//const data = await response.json();
	const vertex_ai = new VertexAI({ project: 'myelectedofficials-415909', location: 'us-central1' });
	const model = 'gemini-1.5-pro-preview-0409';

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
		text: `List the differences between the two versions of legislative bills separated by '==>':

${fromVersion}\n\n==>\n${toVersion}`
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
				if (!item.candidates) {
					continue;
				}

				controller.enqueue(
					encoder.encode(
						JSON.stringify(
							item.candidates.flatMap((c) => c.content.parts.flatMap((p) => p.text).join(' '))
						)
					)
				);
			}
			controller.close();
		}
	});

	return new Response(readable, { headers });
}
