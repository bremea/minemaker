import { pool } from '../connection';
import { InternalApiError, Nullable } from '../utils';
import { t } from 'elysia';
import { GameSchema, parseDatabaseGame } from './game';
import { getUserByAccountId, parseProfileFromUser, Profile, ProfileSchema } from './user';

export enum ArtifactType {
	Plugin = 'PLUGIN',
	Level = 'LEVEL',
	ResourcePack = 'RESOURCE_PACK',
	DataPack = 'DATA_PACK',
	PluginData = 'PLUGIN_DATA'
}

export const ArtifactSchema = t.Object({
	uuid: t.String(),
	type: t.Enum(ArtifactType),
	key: t.String(),
	checksum: t.String(),
	uploaded: t.Date()
});

export const BuildSchema = t.Object({
	id: t.String(),
	game: GameSchema,
	author: ProfileSchema,
	description: Nullable(t.String()),
	authorIp: t.String(),
	live: t.Boolean(),
	manifest: t.Any(),
	artifacts: t.Array(ArtifactSchema)
});

export type Build = typeof BuildSchema.static;
export type Artifact = typeof ArtifactSchema.static;

function parseDatabaseBuild(data: any): Build {
	return {
		...parseDatabasePartialBuild(data),
		game: parseDatabaseGame(data['game']),
		artifacts: data['artifacts'].map((a: any) => parseDatabaseArtifact(a))
	};
}

function parseDatabasePartialBuild(data: any): Omit<Build, 'game' | 'artifacts'> {
	return {
		id: data.id.toString(),
		description: data['description'],
		author: parseProfileFromUser(data['author']),
		live: data['live'],
		authorIp: data['author_ip'],
		manifest: data['manifest']
	};
}

function parseDatabaseArtifact(data: any): Artifact {
	return {
		uuid: data['uuid'],
		type: data['type'],
		key: data['key'],
		checksum: data['checksum'],
		uploaded:
			typeof data['uploaded'] == 'string' ? new Date(data['uploaded']) : data['uploaded']
	};
}

export async function getArtifactByUUID(uuid: string): Promise<Artifact> {
	const res = await pool.query({
		text: `SELECT * FROM artifacts WHERE uuid = $1`,
		values: [uuid]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No artifact exists with uuid ${uuid}`);
	}

	return parseDatabaseArtifact(res.rows[0]);
}

export async function getBuildById(id: string): Promise<Build> {
	const res = await pool.query({
		text: `SELECT b.*,
				COALESCE(jsonb_agg(to_jsonb(a)) FILTER (WHERE a.uuid IS NOT NULL), '[]') AS artifacts,
				
				to_jsonb(g) || jsonb_build_object(
					'owner', jsonb_build_object(
					'account', to_jsonb(go),
					'player', to_jsonb(gp)
					)
				) AS game,

				jsonb_build_object(
					'account', to_jsonb(au),
					'player', to_jsonb(ap)
				) AS author,

				COALESCE(g.current_build = b.id, false) AS live

				FROM builds b

				LEFT JOIN build_artifacts ba ON ba.build_id = b.id
				LEFT JOIN artifacts a ON a.uuid = ba.artifact_uuid

				LEFT JOIN games g ON g.id = b.game_id
				LEFT JOIN accounts go ON go.id = g.owner
				LEFT JOIN players gp ON gp.uuid = go.mc_uuid

				LEFT JOIN accounts au ON au.id = b.author_id
				LEFT JOIN players ap ON ap.uuid = au.mc_uuid

				WHERE b.id = $1

				GROUP BY
				b.id,
				g.id,
				go.id,
				gp.uuid,
				au.id,
				ap.uuid`,
		values: [id]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(400, `No build exists with id ${id}`);
	}

	console.log(res.rows[0])

	return parseDatabaseBuild(res.rows[0]);
}

export async function getBuildsByGameId(id: string): Promise<Omit<Build, 'game' | 'artifacts'>[]> {
	const res = await pool.query({
		text: `SELECT b.*,				
				jsonb_build_object(
					'account', to_jsonb(au),
					'player', to_jsonb(ap)
				) AS author,

				COALESCE(g.current_build = b.id, false) AS live

				FROM builds b

				LEFT JOIN accounts au ON au.id = b.author_id
				LEFT JOIN players ap ON ap.uuid = au.mc_uuid
				LEFT JOIN games g ON g.id = b.game_id

				WHERE b.game_id = $1`,
		values: [id]
	});

	return res.rows.map((b) => parseDatabasePartialBuild(b));
}
