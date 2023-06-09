export function stringToBytes(string) {
  return [...string].map((character) => character.charCodeAt(0));
}

/**
Checks whether the TAR checksum is valid.
@param {Buffer} buffer - The TAR header `[offset ... offset + 512]`.
@param {number} offset - TAR header offset.
@returns {boolean} `true` if the TAR checksum is valid, otherwise `false`.
*/
export function tarHeaderChecksumMatches(buffer, offset = 0) {
  const readSum = Number.parseInt(
    buffer.toString('utf8', 148, 154).replace(/\0.*$/, '').trim(),
    8,
  ); // Read sum in header
  if (Number.isNaN(readSum)) {
    return false;
  }

  let sum = 8 * 0x20; // Initialize signed bit sum

  for (let i = offset; i < offset + 148; i++) {
    sum += buffer[i];
  }

  for (let i = offset + 156; i < offset + 512; i++) {
    sum += buffer[i];
  }

  return readSum === sum;
}

/**
ID3 UINT32 sync-safe tokenizer token.
28 bits (representing up to 256MB) integer, the msb is 0 to avoid "false syncsignals".
*/
export const uint32SyncSafeToken = {
  get: (buffer, offset) =>
    (buffer[offset + 3] & 0x7f) |
    (buffer[offset + 2] << 7) |
    (buffer[offset + 1] << 14) |
    (buffer[offset] << 21),
  len: 4,
};
