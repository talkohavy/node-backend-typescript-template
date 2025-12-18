export type CreateDragonDto = {
  name: string;
  author: string;
  publishedYear: number;
};

export type UpdateDragonDto = {
  name?: string;
  author?: string;
  publishedYear?: number;
};
