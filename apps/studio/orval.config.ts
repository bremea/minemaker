export default {
	api: {
		input: 'http://localhost:3000/swagger/json',
		output: {
			target: './src/lib/api-client.ts',
			client: 'fetch',
			override: {
				mutator: {
					path: './src/lib/customFetch.ts',
					name: 'customFetch'
				}
			}
		}
	}
};
