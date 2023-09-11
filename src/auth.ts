// based from https://developers.cloudflare.com/workers/examples/signing-requests/

// Convert a ByteString (a string whose code units are all in the range
// [0, 255]), to a Uint8Array. If you pass in a string with code units larger
// than 255, their values will overflow.
function byteStringToUint8Array(byteString: string) {
  const ui = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; ++i) {
    ui[i] = byteString.charCodeAt(i);
  }
  return ui;
}

export async function verifyRequest(
  requestBody: Record<string, unknown>,
  secretKey: string
): Promise<boolean> {
  try {
    // ensure the correct properties exist
    if (typeof requestBody.signature !== 'string') {
      console.error('verifyRequest: signature not present in request as string');
      return false;
    }
    if (typeof requestBody.data !== 'string') {
      console.error('verifyRequest: data not present in request as string');
      return false;
    }

    const encoder = new TextEncoder();

    // bring in signature
    const signature = requestBody.signature;
    const signatureUInt8Array = byteStringToUint8Array(atob(signature));

    // bring in the private symmetric key
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      {
        name: 'HMAC',
        hash: 'SHA-256'
      },
      false,
      ['verify']
    );

    // verify that the signatures match the data
    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureUInt8Array,
      encoder.encode(requestBody.data)
    );

    return verified;
  } catch (error) {
    console.error('an error occurred during request verification:\n', (error as Error).stack);
    return false;
  }
}
