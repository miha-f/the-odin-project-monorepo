export type Success<T> = { data: T };
export type Failure = { error: string };

export const success = <T>(data: T): Success<T> => ({ data });
export const failure = (error: string): Failure => ({ error });
