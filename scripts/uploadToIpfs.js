const ipfsClient = require('ipfs-http-client');
const fs = require('fs');

const projectId = process.env.IPFS_PROJECT_SECRET;
const projectSecret = process.env.IPFS_PROJECT_ID;
console.log({ projectId, projectSecret });
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
async function main() {
    const client = ipfsClient.create({
        url: 'https://ipfs.infura.io:5001/api/v0',
        headers: {
            authorization: auth,
        },

        // host: 'ipfs.infura.io',
        // port: 5001,
        // protocol: 'https',
    });

    console.log(client);

    const file = fs.readFileSync(__dirname.concat('/../img/mushroom_gold.GIF'));
    console.log(await client.add(file));
    // console.log(file);
}

main().then(console.log).catch(console.log);

// client.pin.add('QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn').then((res) => {
//     console.log(res);
// });
