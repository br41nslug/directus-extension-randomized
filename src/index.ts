import { defineEndpoint } from '@directus/extensions-sdk';

function shuffleArray(input: any[]): any[] {
	let currentIndex = input.length, temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		temporaryValue = input[currentIndex];
		input[currentIndex] = input[randomIndex];
		input[randomIndex] = temporaryValue;
	}
	return input;
}

function getRandomItems(input: any[], amount: number): any[] {
	let inputLength = input.length, remainingElements = Math.min(amount, inputLength), temporaryValue, randomIndex;

	while (remainingElements) {
		randomIndex = Math.floor(Math.random() * inputLength);
		inputLength--;
		temporaryValue = input[inputLength];
		input[inputLength] = input[randomIndex];
		input[randomIndex] = temporaryValue;
		remainingElements--;
	}
	return input.slice(inputLength);
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
