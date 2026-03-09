import { Site } from "./site";

export interface Prompt {
  id: number;
  appointment: string;
  prompt: string;
  description: string;
  customized: boolean;
  default: boolean;
  siteId: number | null;
}

export interface UpdatePromptRequest {
  description: string;
  prompt: string;
}
