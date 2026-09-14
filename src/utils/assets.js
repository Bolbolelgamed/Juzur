export function responsiveImageSet(src) {
  if (src.includes('new-photos/juzur-photo-01.webp')) {
    return `${src.replace('.webp', '-480.webp')} 480w, ${src} 702w`;
  }
  return `${src.replace('.webp', '-480.webp')} 480w, ${src.replace('.webp', '-960.webp')} 960w, ${src} 1484w`;
}

export function thumbnailImage(src) {
  return src.replace('.webp', '-480.webp');
}
