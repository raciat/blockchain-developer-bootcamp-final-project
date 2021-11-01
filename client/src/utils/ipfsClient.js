import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';
import { BufferList } from 'bl';

const IPFS_PROJECT_ID = process.env.REACT_APP_IPFS_PROJECT_ID;
const IPFS_PROJECT_SECRET = process.env.REACT_APP_IPFS_PROJECT_SECRET;

const ipfsHeaders = {};
if (IPFS_PROJECT_ID && IPFS_PROJECT_SECRET) {
  ipfsHeaders.authorization = 'Basic ' + Buffer.from(IPFS_PROJECT_ID + ':' + IPFS_PROJECT_SECRET).toString('base64');
}

export const ipfsClient = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https', headers: ipfsHeaders });

export const getFromIPFS = async hashToGet => {
  const content = new BufferList();
  for await (const file of ipfsClient.get(hashToGet)) {
    content.append(file);
  }

  let parsedContent = content.toString();
  parsedContent = parsedContent.slice(parsedContent.indexOf('{'));
  parsedContent = parsedContent.slice(0, parsedContent.indexOf('}') + 1);

  let json = {};
  try {
    json = JSON.parse(parsedContent);
  } catch (e) {}

  return json;
};

