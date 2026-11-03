export interface Prompter {
  ask(question: string): Promise<string>;
  askSecret(question: string): Promise<string>;
  show(message: string): void;
}

export class PromptCancelledError extends Error {
  public constructor() {
    super('Operação cancelada.');
    this.name = 'PromptCancelledError';
  }
}
