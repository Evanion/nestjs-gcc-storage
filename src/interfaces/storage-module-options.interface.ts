export interface StorageModuleOptions {
  projectId: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
  bucket: string;
}
