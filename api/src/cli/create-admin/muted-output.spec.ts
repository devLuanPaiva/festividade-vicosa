import { MutedOutput } from './muted-output';

function createOutput(): { output: MutedOutput; written: string[] } {
  const written: string[] = [];
  const output = new MutedOutput({
    write: (chunk: string | Uint8Array): boolean => {
      written.push(String(chunk));
      return true;
    },
  });
  return { output, written };
}

describe('MutedOutput', () => {
  it('passes the text through while it is not muted', () => {
    const { output, written } = createOutput();

    output.stream.write('E-mail: ');

    expect(written).toEqual(['E-mail: ']);
  });

  it('swallows everything typed while muted, which is what hides the password', () => {
    const { output, written } = createOutput();

    output.muted = true;
    output.stream.write('s3cr3t');
    output.muted = false;
    output.stream.write('ok');

    expect(written).toEqual(['ok']);
  });
});
