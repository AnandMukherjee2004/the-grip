// scripts/test-registry.ts
import { getConnector, listConnectors } from '../src/lib/connector-registry'

console.log(getConnector('razorpay'))       // should print full meta
console.log(getConnector('nonexistent'))    // should print undefined
console.log(listConnectors().map(c => c.toolId)) // should list all 8 tools