import { RouterInput, RouterOutput } from "@/utils/trpc";
export type User = RouterOutput["user"]["list"]["users"][0];
export type Role = RouterOutput["role"]["all"][0];
export type CreateUserValues = RouterInput["user"]["add"];
