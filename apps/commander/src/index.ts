import Docker from 'dockerode';
import Commander from './commander';
import { generateServerId, getServerGateway, getServerSubnet } from './utils';

if (!process.env.SERVER_ID) throw new Error('Missing server ID');
if (!process.env.REGION) throw new Error('Missing region');
if (!process.env.REGION_ID) throw new Error('Missing region ID');
if (!process.env.IP_BASE) throw new Error('Missing IP base');

const region = process.env.REGION;
const regionId = parseInt(process.env.REGION_ID);
const serverId = parseInt(process.env.SERVER_ID);
const baseIp = process.env.IP_BASE;

const name = generateServerId(regionId, serverId);

const docker = new Docker();

await docker.pruneNetworks();

const network = await docker.createNetwork({
	Name: `${name}-network`,
	EnableIPv6: true,
	IPAM: {
		Driver: 'default',
		Config: [
			{
				Subnet: getServerSubnet(baseIp, regionId, serverId),
				Gateway: getServerGateway(baseIp, regionId, serverId)
			}
		]
	}
});

const commander = new Commander({
	region: {
		name: region,
		id: regionId
	},
	name,
	id: serverId,
	docker,
	network,
	baseIp
});
