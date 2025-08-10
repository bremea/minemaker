import { pool } from '../connection';
import { Game, parseDatabaseGame } from './game';

export async function getFeaturedGames(): Promise<Game[]> {
	const res = await pool.query({
		text: `SELECT g.*, jsonb_build_object('account', to_jsonb(a), 'player', to_jsonb(p)) AS owner, f.featured_at FROM featured_games f JOIN games g ON g.id = f.id JOIN accounts a ON a.id = g.owner LEFT JOIN players p ON p.uuid = a.mc_uuid ORDER BY f.featured_at DESC LIMIT 10;`
	});

	return await Promise.all(res.rows.map(async (e) => await parseDatabaseGame(e)));
}
