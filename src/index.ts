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
	let l = input.length, m = Math.min(amount, l), t, i;
	while (m) {
		i = Math.floor(Math.random() * l--);
		t = input[l];
		input[l] = input[i];
		input[i] = t;
		m--;
	}
	return input.slice(l);
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
					res.json(shuffleArray(data));
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
