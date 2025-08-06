import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function getRequestScript(): Promise<string> {
	const filePath = join(__dirname, '../scripts/request.lua');
	return await readFile(filePath, 'utf-8');
}

export async function getMatchmakerScript(): Promise<string> {
	const filePath = join(__dirname, '../scripts/matchmaker.lua');
	return await readFile(filePath, 'utf-8');
}
