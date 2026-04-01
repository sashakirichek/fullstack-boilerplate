export class PrismaClient {
  constructor(_opts?: unknown) {}
  post = {
    findMany: async () => [],
    findUnique: async () => null,
  }
  user = {
    upsert: async () => ({id: 'mock-id', provider: 'google', providerId: 'mock'}),
  }
}
