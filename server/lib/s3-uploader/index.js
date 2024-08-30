import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);
import { uploadFile } from './s3.js';

export default async function (file, options = {}) {
    const obj = await uploadFile(file, options);
    if (!options.retainFile) await unlinkFile(file.path);
    return obj;
};
