import { defineEndpoint } from '@directus/extensions-sdk';

function shuffleArray(input: any[]): any[] {
	let m = input.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = input[m];
		input[m] = input[i];
		input[i] = t;
	}
	return input;
}
function getRandomItems(input: any[], amount: number): any[] {
	let m = Math.min(input.length), t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = input[m];
		input[m] = input[i];
		input[i] = t;
	}
	return input.slice(0, Math.min(amount, input.length));
}

export default defineEndpoint({
	id: 'randomized',
	handler: (router, { services }) => {
		const { ItemsService } = services;
		router.get('/:collection', async (_req: any, res: any) => {
			const itemService = new ItemsService(_req.params.collection, { 
				schema: _req.schema,
				accountability: _req.accountability
			});
			try {
				if (+_req.sanitizedQuery?.limit > 0) {
					const limit: number = _req.sanitizedQuery.limit;
					const ids = getRandomItems(await itemService.readByQuery({ 
						..._req.sanitizedQuery, limit: -1, fields: ['id'] 
					}), limit).map(({ id }) => id);
					const filter = _req.sanitizedQuery.filter ? 
						{ _and: [{ id: { _in: ids } }, _req.sanitizedQuery.filter] } :
						{ id: { _in: ids } }
					const data = await itemService.readByQuery({ ..._req.sanitizedQuery, filter });
					res.json(data);
				} else {
					const data = await itemService.readByQuery(_req.sanitizedQuery);
					res.json(shuffleArray(data));
				}
			} catch (err) {
				res.json(err)
			}
		});
	},
});
