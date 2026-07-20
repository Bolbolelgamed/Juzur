export function normalizeEgyptianMobile(value) {
  let compact = String(value).trim().replace(/[\s()-]/g, '');

  if (compact.startsWith('+20')) {
    compact = `0${compact.slice(3)}`;
  } else if (compact.startsWith('0020')) {
    compact = `0${compact.slice(4)}`;
  }

  return compact;
}

export function isValidEgyptianMobile(value) {
  return /^01[0125]\d{8}$/.test(normalizeEgyptianMobile(value));
}
