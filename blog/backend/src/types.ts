import { AppError } from "@/errors";

export type Uuid = string;
export type Token = string;

export type ServiceResult<T> = Promise<[T | null, AppError | null]>;
export type DbResult<T> = Promise<T | null>;
