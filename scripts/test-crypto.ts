// scripts/test-crypto.ts
import { encryptCredentials, decryptCredentials } from '../src/lib/crypto'

const original = { api_key: 'rzp_test_xxx', api_secret: 'yyy' }
const enc = encryptCredentials(original)
const dec = decryptCredentials(enc)

console.log('Match:', JSON.stringify(original) === JSON.stringify(dec))
// Should print: Match: true