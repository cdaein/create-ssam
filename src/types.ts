import type kleur from "kleur";

export type InstallCommandsGroup = {
  dep?: string;
  devDep?: string;
  git?: string;
};

export type TemplateOption = {
  name: string;
  display: string;
  description: string;
  color: kleur.Color;
  installCommands?: InstallCommandsGroup;
};

export type Template = {
  name: string;
  display: string;
  description: string;
  color: kleur.Color;
  options: TemplateOption[];
};

export type ExtraPack = {
  title: string;
  description: string;
  value: InstallCommandsGroup;
};
