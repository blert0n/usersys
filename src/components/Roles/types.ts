import { RouterInput, RouterOutput } from "@/utils/trpc";
export type Role = RouterOutput["role"]["list"]["roles"][0];
export type RoleCreateInput = RouterInput["role"]["upsert"];
