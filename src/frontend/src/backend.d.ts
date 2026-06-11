import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    addTodo(text: string): Promise<bigint>;
    deleteTodo(id: bigint): Promise<void>;
    getTodos(): Promise<Array<{
        id: bigint;
        text: string;
        completed: boolean;
    }>>;
    toggleTodo(id: bigint): Promise<void>;
}
