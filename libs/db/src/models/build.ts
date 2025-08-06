import { t } from 'elysia';
import { pool } from '../connection';
import { ArtifactType, ArtifactUploadStatus } from '../types/enums';
import { InternalApiError, Nullable } from '../utils';
import { GameSchema, parseDatabaseGame } from './game';
import { parseProfileFromUser, ProfileSchema } from './user';

export const ArtifactMetadataSchema = Nullable(t.Union([t.String(), t.Array(t.String())]));

export const ArtifactSchema = t.Object({
	uuid: t.String(),
	name: t.String(),
	type: t.Enum(ArtifactType),
	status: t.Enum(ArtifactUploadStatus),
	key: t.String(),
	checksum: Nullable(t.String()),
	uploaded: Nullable(t.Date()),
	metadata: ArtifactMetadataSchema
});

export const BuildSchema = t.Object({
	id: t.String(),
	game: GameSchema,
	author: ProfileSchema,
	description: Nullable(t.String()),
	authorIp: t.String(),
	live: t.Boolean(),
	artifacts: t.Array(ArtifactSchema)
});

export type Build = typeof BuildSchema.static;
export type Artifact = typeof ArtifactSchema.static;
export type ArtifactMetadata = typeof ArtifactMetadataSchema.static;
export type BuildOmitGameArtifacts = Omit<Build, 'game' | 'artifacts'>;

async function parseDatabaseBuild(data: any): Promise<Build> {
	return {
		...parseDatabasePartialBuild(data),
		game: await parseDatabaseGame(data['game']),
		artifacts: data['artifacts'].map((a: any) => parseDatabaseArtifact(a))
	};
}

function parseDatabasePartialBuild(data: any): BuildOmitGameArtifacts {
	return {
		id: data.id.toString(),
		description: data['description'],
		author: parseProfileFromUser(data['author']),
		live: data['live'],
		authorIp: data['author_ip']
	};
}

function parseDatabaseArtifact(data: any): Artifact {
	return {
		uuid: data['uuid'],
		name: data['name'],
		type: data['type'],
		key: data['key'],
		checksum: data['checksum'],
		status: data['status'],
		uploaded: data['uploaded'] ? (typeof data['uploaded'] == 'string' ? new Date(data['uploaded']) : data['uploaded']) : undefined,
		metadata: data['metadata']
	};
}

export async function getArtifactByUUID(uuid: string): Promise<Artifact> {
	const res = await pool.query({
		text: `SELECT * FROM artifacts WHERE uuid = $1`,
		values: [uuid]
	});

	if (res.rows.length == 0) {
		throw new InternalApiError(404, `No artifact exists with uuid ${uuid}`);
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
		throw new InternalApiError(404, `No build exists with id ${id}`);
	}

	return await parseDatabaseBuild(res.rows[0]);
}

export async function getBuildsByGameId(id: string): Promise<BuildOmitGameArtifacts[]> {
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

export async function createBuild(id: string, gameId: string, authorId: string, authorIp: string, description: string | null): Promise<BuildOmitGameArtifacts> {
	const res = await pool.query({
		text: `WITH build AS 
					(INSERT INTO builds (id, game_id, author_id, author_ip, description) VALUES($1, $2, $3, $4, $5) RETURNING *) 
				SELECT b.*,
				jsonb_build_object(
					'account', to_jsonb(au),
					'player', to_jsonb(ap)
				) AS author,

				COALESCE(g.current_build = b.id, false) AS live

				FROM build b

				LEFT JOIN accounts au ON au.id = b.author_id
				LEFT JOIN players ap ON ap.uuid = au.mc_uuid
				LEFT JOIN games g ON g.id = b.game_id`,
		values: [id, gameId, authorId, authorIp, description]
	});

	return parseDatabasePartialBuild(res.rows[0]);
}

export async function createArtifact(buildId: string, uuid: string, name: string, type: string, key: string, metadata: any | null): Promise<Artifact> {
	const res = await pool.query({
		text: `INSERT INTO artifacts (uuid, name, type, key, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
		values: [uuid, name, type, key, metadata]
	});

	await linkArtifactToBuild(buildId, uuid);

	return parseDatabaseArtifact(res.rows[0]);
}

export async function linkArtifactToBuild(buildId: string, artifactUUID: string): Promise<void> {
	await pool.query({
		text: `INSERT INTO build_artifacts (build_id, artifact_uuid) VALUES ($1, $2)`,
		values: [buildId, artifactUUID]
	});
}
