import { createCommand, type LexicalCommand } from "lexical";

export type INSERT_EQUATION_COMMAND_PAYLOAD = {
  equation: string;
  inline: boolean;
};

export const INSERT_EQUATION_COMMAND: LexicalCommand<INSERT_EQUATION_COMMAND_PAYLOAD> =
  createCommand("INSERT_EQUATION_COMMAND");
