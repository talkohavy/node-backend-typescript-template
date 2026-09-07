export type FeatureFlag = {
  id: number;
  key: string;
  isEnabled: boolean;
  description: string | null;
  createdAt: number;
  updatedAt: number;
};
