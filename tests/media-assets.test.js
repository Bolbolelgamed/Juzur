import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { uploadedPhotos, uploadedVideos } from '../src/config/media.js';
import { responsiveImageSet } from '../src/utils/assets.js';

const readAsset = (file) => readFile(new URL(`../public/assets/uploads/${file}`, import.meta.url));

for (const photo of uploadedPhotos) {
  test(`${photo.file} stays within responsive photo budgets`, async () => {
    const original = await readAsset(photo.file);
    const thumbnail = await readAsset(photo.file.replace('.webp', '-480.webp'));
    assert.equal(original.toString('ascii', 8, 12), 'WEBP');
    assert(original.length <= 200000, 'full-size photo exceeds 200 KB');
    assert(thumbnail.length <= 40000, 'thumbnail exceeds 40 KB');
    const src = `/assets/uploads/${photo.file}`;
    const widths = responsiveImageSet(src).split(', ').map((candidate) => Number(candidate.match(/ (\d+)w$/)[1]));
    assert.equal(new Set(widths).size, widths.length, 'responsive candidates repeat a width');
    assert.equal(widths.at(-1), photo.width);
    if (photo.width > 960) {
      const medium = await readAsset(photo.file.replace('.webp', '-960.webp'));
      assert(medium.length <= 110000, 'medium photo exceeds 110 KB');
    }
  });
}

for (const video of uploadedVideos) {
  test(`${video.file} stays below 2 MB and can start streaming before download completes`, async () => {
    const data = await readAsset(video.file);
    assert(data.length <= 2000000, 'video exceeds 2 MB');
    const atoms = [];
    let offset = 0;
    while (offset < data.length) {
      const size = data.readUInt32BE(offset);
      assert(size >= 8 && offset + size <= data.length, 'invalid MP4 box boundary');
      atoms.push(data.toString('ascii', offset + 4, offset + 8));
      offset += size;
    }
    assert(atoms.includes('moov') && atoms.includes('mdat'));
    assert(atoms.indexOf('moov') < atoms.indexOf('mdat'), 'MP4 index must precede the video data');
    const poster = await readAsset(video.poster);
    assert(poster.length <= 65000, 'video preview exceeds 65 KB');
  });
}
