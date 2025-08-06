import { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import { Artifact, ArtifactMetadataSchema, ArtifactSchema, ArtifactType, BuildSchema, checkGameOwner, createArtifact, createBuild, getBuildById, UnauthorizedApiError } from '@minemaker/db';
import { requireAccountAndPlayer } from '$src/lib/middleware/auth';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default (app: ElysiaApp) =>
	app.use(requireAccountAndPlayer).post(
		'/',
		async ({ user, params, ip, body, snowflake, r2 }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '') {
				ip = '127.0.0.1';
			}

			if (!(await checkGameOwner(params.id, user.account.id))) {
				throw UnauthorizedApiError;
			}

			const id = snowflake.nextId().toString();

			await createBuild(id, params.id, user.account.id, ip, body.description ?? null);

			const artifacts: (Artifact & { uploadUrl: string })[] = [];

			for (const artifact of body.artifacts) {
				const uuid = randomUUID();

				const newArtifact = await createArtifact(id, uuid, artifact.name, artifact.type, uuid, artifact.metadata ?? null);

				const uploadUrl = await getSignedUrl(r2, new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: uuid }), { expiresIn: 3600 });

				artifacts.push({ ...newArtifact, uploadUrl });
			}

			const build = await getBuildById(id);

			return { build, artifacts };
		},
		{
			detail: {
				summary: 'Creates a new game build',
				operationId: 'CreateBuild'
			},
			body: t.Object({
				description: t.Optional(
					t.String({
						description: 'Optional description for the build',
						error: 'Invalid description',
						maxLength: 255
					})
				),
				artifacts: t.Array(
					t.Object({
						name: t.String({ description: 'Name for this artifact' }),
						type: t.Enum(ArtifactType, { description: 'Type for this artifact' }),
						metadata: t.Optional(ArtifactMetadataSchema)
					}),
					{
						description: 'An array of artifacts associated with this build',
						error: ' Invalid artifact array'
					}
				)
			}),
			params: t.Object({
				id: t.String({ error: 'Invalid game id' })
			}),
			response: {
				200: t.Object({
					build: BuildSchema,
					artifacts: t.Array(t.Intersect([ArtifactSchema, t.Object({ uploadUrl: t.String() })]))
				})
			},
			parse: 'application/json'
		}
	);
