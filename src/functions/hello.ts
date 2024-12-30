import { response } from '@/utils/response';
import { randomUUID } from 'node:crypto';

export async function handler() {
  return response(200, { hello: 'world!', id: randomUUID() });
}
