export interface ApiKey {
  _id: string;
  name: string;
  webhook: string;
  key?: string; // Only present when creating new key
  createdAt: string;
  lastUsed?: string;
}
