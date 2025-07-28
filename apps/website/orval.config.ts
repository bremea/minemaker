export default {
	api: {
		input: 'http://localhost:3000/swagger/json',
		output: {
			target: './src/lib/api-client.ts',
			client: 'fetch'
		}
	}
};
