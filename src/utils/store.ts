import { create } from 'zustand';
import { type Session as SupabaseSession } from '@supabase/supabase-js'
import supabase from './supabase';

export type TODO = {
    id: number;
    todo: string;
    user_id: string;
    created_at: string;
    order_id: string;
    category: string;
}

interface Store {
    session?: SupabaseSession
    setSession: (session?: SupabaseSession) => void
    do_todos: TODO[]
    delegate_todos: TODO[]
    schedule_todos: TODO[]
    delete_todos: TODO[]
    set_do_todos: (todos: TODO[]) => void
    set_delegate_todos: (todos: TODO[]) => void
    set_schedule_todos: (todos: TODO[]) => void
    set_delete_todos: (todos: TODO[]) => void
    fetch_todos: (category: string) => void
}

export const useStore = create<Store>((set) => ({
    do_todos: [],
    delegate_todos: [],
    schedule_todos: [],
    delete_todos: [],
    setSession: (session) => set((_) => ({ session })),
    set_do_todos: (todos: TODO[]) => set((_) => ({do_todos: todos})),
    set_delegate_todos: (todos: TODO[]) => set((_) => ({delegate_todos: todos})),
    set_schedule_todos: (todos: TODO[]) => set((_) => ({schedule_todos: todos})),
    set_delete_todos: (todos: TODO[]) => set((_) => ({delete_todos: todos})),
    fetch_todos: async (category: string) => {
        const {data, error} = await supabase.from("todos").select("*").eq("category", category).order("order_id");
        if(!error){
            switch (category) {
                case "do":
                    set((_) => ({do_todos: data}))
                    break;
                case "delegate":
                    set((_) => ({delegate_todos: data}))
                    break;
                case "schedule":
                    set((_) => ({schedule_todos: data}))
                    break;
                case "delete":
                    set((_) => ({delete_todos: data}))
                    break;
                default:
                    break;
            }
        }
    }
}))
