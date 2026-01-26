import type { ColorKey } from "./utils";

export type InstallCommandsGroup = {
  dep?: string;
  devDep?: string;
  git?: string;
};

export type TemplateOption = {
  name: string;
  display: string;
  description: string;
  color: ColorKey;
  installCommands?: InstallCommandsGroup;
};

export type Template = {
  name: string;
  display: string;
  description: string;
  color: ColorKey;
  options: TemplateOption[];
};

export type ExtraPack = {
  title: string;
  description: string;
  value: InstallCommandsGroup;
};
