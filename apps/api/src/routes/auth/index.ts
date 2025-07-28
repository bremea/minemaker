import { ElysiaApp } from '$src/app';

export default (app: ElysiaApp) =>
	app.get('/', async () => {
		return { meow: true };
	});
