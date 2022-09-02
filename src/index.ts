import { defineEndpoint } from '@directus/extensions-sdk';

function shuffleArray(input: any[]): any[] {
	let result = [];
	while (input.length > 0) {
		const element = input.splice(Math.floor(Math.random() * input.length), 1);
		result.push(element[0]);       
	}
	return result;
}
function getRandomItems(input: any[], amount: number): any[] {
	let result = [], _amount = Math.min(amount, input.length - 1);
	while (result.length < _amount) {
		const element = input.splice(Math.floor(Math.random() * input.length), 1);
		result.push(element[0]);       
	}
	return result;
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
