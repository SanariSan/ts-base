import type { TFIFOMutexQueue } from './fifo.type';

export class FIFOMutex {
  /**
   * When multiple operations attempt to acquire the lock,
   * this queue remembers the order of operations.
   */
  private readonly queue: TFIFOMutexQueue = [];
  private isLocked = false;

  /**
   * Enqueue a function to be run serially.
   *
   * This ensures no other functions will start running
   * until `callback` finishes running.
   */
  async runExclusive<T>(callback: () => T | Promise<T>): Promise<T> {
    const release = await this.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }

  /**
   * Wait until the lock is acquired.
   */
  private async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      this.queue.push({ resolve });
      this.dispatch();
    });
  }

  /**
   * Check the availability of the resource
   * and provide access to the next operation in the queue.
   *
   * dispatch is called whenever availability changes,
   * such as after lock acquire request or lock release.
   */
  private dispatch(): void {
    // The resource is still locked, wait until next time.
    if (this.isLocked) return;

    const nextEntry = this.queue.shift();

    // There is nothing in the queue, do nothing until next dispatch.
    if (!nextEntry) return;

    // The resource is available, lock it.
    this.isLocked = true;

    // Give access to the next operation in the queue.
    nextEntry.resolve(this.buildRelease());
  }

  /**
   * Build a release function for each operation
   * so that it can release the lock after
   * the operation is complete.
   */
  private buildRelease(): () => void {
    return () => {
      // Each release function makes the resource available again.
      this.isLocked = false;

      // And call dispatch to keep processing queue.
      this.dispatch();
    };
  }
}
