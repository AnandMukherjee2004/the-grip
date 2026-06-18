import { db } from '../src/db/index';
import { connectors } from '../src/db/schema';

async function main() {
  const allConnectors = await db.select().from(connectors).limit(5);
  console.log('Connectors in DB:', JSON.stringify(allConnectors, null, 2));
  process.exit(0);
}

main().catch(console.error);
