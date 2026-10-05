import { uploadedPhotos } from '../config/media.js';

export function responsiveImageSet(src) {
  const uploadedPhoto = uploadedPhotos.find((photo) => src.endsWith(`uploads/${photo.file}`));
  if (uploadedPhoto) {
    return [
      `${src.replace('.webp', '-480.webp')} 480w`,
      ...(uploadedPhoto.width > 960 ? [`${src.replace('.webp', '-960.webp')} 960w`] : []),
      `${src} ${uploadedPhoto.width}w`,
    ].join(', ');
  }
  if (src.includes('new-photos/juzur-photo-01.webp')) {
    return `${src.replace('.webp', '-480.webp')} 480w, ${src} 702w`;
  }
  return `${src.replace('.webp', '-480.webp')} 480w, ${src.replace('.webp', '-960.webp')} 960w, ${src} 1484w`;
}

export function thumbnailImage(src) {
  return src.replace('.webp', '-thumb.webp');
}
