import { Site } from "./site";

export interface Contact {
  id: number;
  number: string;
  site?: Site;
}

export interface CreateOrUpdateContactRequest {
  number: string;
}
