export function responsiveImageSet(src) {
  return `${src.replace('.webp', '-480.webp')} 480w, ${src.replace('.webp', '-960.webp')} 960w, ${src} 1484w`;
}

export function thumbnailImage(src) {
  return src.replace('.webp', '-480.webp');
}
