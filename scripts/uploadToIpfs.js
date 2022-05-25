const ipfsClient = require('ipfs-http-client');
const fs = require('fs');

const projectId = '29dKo88MabWrikDdttl2Bzs9d2a';
const projectSecret = '60af812f5cfe5908db6d4d3e61671e5d';

console.log({ projectId, projectSecret });

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

async function main() {
    const client = ipfsClient.create({
        url: 'https://ipfs.infura.io:5001/api/v0',
        headers: {
            authorization: auth,
        },
    });

    const gold = fs.readFileSync(__dirname.concat('/../img/mushroom_gold.GIF'));
    const silver = fs.readFileSync(__dirname.concat('/../img/mushroom_silver.GIF'));
    const [goldImageIpfsResult, silverImageIpfsResult] = await Promise.all([
        client.add(gold),
        client.add(silver),
    ]);

    const metadata = [
        JSON.stringify({
            description: 'Gold Mushroom Pendant',
            external_url: 'https://sneakybirdusa.com',
            image: `https://sneakybird.infura-ipfs.io/ipfs/${goldImageIpfsResult.path}`,
            name: 'Gold Mushroom Pendant',
            attributes: [
                {
                    trait_type: 'type',
                    value: 'ring',
                },
                {
                    trait_type: 'material',
                    value: 'gold',
                },
                {
                    trait_type: 'shape',
                    value: 'mushroom',
                },
                {
                    trait_type: 'purity',
                    value: '18k',
                },
            ],
        }),
        JSON.stringify({
            description: 'Silver Mushroom Pendant',
            external_url: 'https://sneakybirdusa.com',
            image: `https://sneakybird.infura-ipfs.io/ipfs/${silverImageIpfsResult.path}`,
            name: 'Silver Mushroom Pendant',
            attributes: [
                {
                    trait_type: 'type',
                    value: 'ring',
                },
                {
                    trait_type: 'material',
                    value: 'silver',
                },
                {
                    trait_type: 'shape',
                    value: 'mushroom',
                },
                {
                    trait_type: 'purity',
                    value: '.925',
                },
            ],
        }),
    ];

    const [goldMetadata, silverMedatada] = await Promise.all(metadata.map(client.add));
    console.log({ goldMetadata, silverMedatada });
}

main().then(console.log).catch(console.log);
