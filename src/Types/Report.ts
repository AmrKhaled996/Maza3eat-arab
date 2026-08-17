import type { Tier } from "./Comment";

export type Report = {
  id: string;
  createdAt: string;
  targetType: string;
  
  reason: string;
  reporter: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    tier:Tier;
  };
};