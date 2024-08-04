export type TFIFOMutexQueueEntry = {
  resolve: (release: () => void) => void;
};

export type TFIFOMutexQueue = TFIFOMutexQueueEntry[];
