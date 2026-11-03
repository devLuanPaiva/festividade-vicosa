import { createInterface, type Interface } from 'node:readline';
import { MutedOutput } from './muted-output';
import { PromptCancelledError, type Prompter } from './prompter';

type LineWaiter = (line: string) => void;

export class TerminalPrompter implements Prompter {
  private readonly output = new MutedOutput(process.stdout);
  private readonly reader: Interface;
  private readonly bufferedLines: string[] = [];
  private waiter: LineWaiter | null = null;
  private rejectWaiter: ((error: Error) => void) | null = null;
  private closed = false;

  public constructor() {
    this.reader = createInterface({
      input: process.stdin,
      output: this.output.stream,
      terminal: process.stdin.isTTY,
    });
    this.reader.on('line', (line) => {
      this.receive(line);
    });
    this.reader.on('SIGINT', () => {
      this.reader.close();
    });
    this.reader.on('close', () => {
      this.closed = true;
      this.rejectWaiter?.(new PromptCancelledError());
    });
  }

  public ask(question: string): Promise<string> {
    this.printPrompt(question);
    return this.nextLine();
  }

  public async askSecret(question: string): Promise<string> {
    process.stdout.write(question);
    this.output.muted = true;
    try {
      return await this.nextLine();
    } finally {
      this.output.muted = false;
      process.stdout.write('\n');
    }
  }

  public show(message: string): void {
    process.stdout.write(`${message}\n`);
  }

  public close(): void {
    this.rejectWaiter = null;
    this.reader.close();
  }

  private printPrompt(question: string): void {
    if (this.closed) {
      process.stdout.write(question);
      return;
    }
    this.reader.setPrompt(question);
    this.reader.prompt();
  }

  private receive(line: string): void {
    if (this.waiter) {
      const deliver = this.waiter;
      this.waiter = null;
      deliver(line);
      return;
    }
    this.bufferedLines.push(line);
  }

  private nextLine(): Promise<string> {
    const buffered = this.bufferedLines.shift();
    if (buffered !== undefined) {
      return Promise.resolve(buffered);
    }
    if (this.closed) {
      return Promise.reject(new PromptCancelledError());
    }
    return new Promise((resolve, reject) => {
      this.waiter = resolve;
      this.rejectWaiter = reject;
    });
  }
}
