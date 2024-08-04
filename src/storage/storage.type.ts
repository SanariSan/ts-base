export type TStoredData = {
  value: unknown;
  misc: {
    expire_at: number;
  };
};

export type TStorage = Map<string, TStoredData>;
