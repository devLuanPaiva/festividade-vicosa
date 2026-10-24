import { Writable } from 'node:stream';

export class MutedOutput {
  public muted = false;
  public readonly stream: Writable;

  public constructor(target: Pick<NodeJS.WritableStream, 'write'>) {
    this.stream = new Writable({
      write: (chunk: Buffer | string, _encoding, callback): void => {
        if (!this.muted) {
          target.write(chunk);
        }
        callback();
      },
    });
  }
}
