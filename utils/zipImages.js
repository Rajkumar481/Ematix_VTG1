import axios from 'axios';
import archiver from 'archiver';
import fs from 'fs';

export const downloadAndZipImages = async (imageUrls, zipPath) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const output = fs.createWriteStream(zipPath);

  archive.pipe(output);

  for (let i = 0; i < imageUrls.length; i++) {
    const response = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
    archive.append(response.data, { name: `image${i + 1}.jpg` });
  }

  await archive.finalize();
  return zipPath;
};
