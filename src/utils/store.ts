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
    date: string,
    todos: Record<string, TODO[]>
    setSession: (session?: SupabaseSession) => void
    setTodos: (category: string, todos: TODO[]) => void
    fetchTodos: (category: string) => void
    clean_todos: () => void
    setDate: (date: Date) => void
}

const getSupabaseDateString = (date: Date) => {
    let full_date = date.getDate().toString();
    full_date = full_date.length == 1 ? '0' + full_date : full_date;

    let full_month = (date.getMonth() + 1).toString();
    full_month = full_month.length == 1 ? '0' + full_month : full_month;

    const _date = date.getFullYear() + "-" + full_month + "-" + full_date;
    return _date;
}

export const useStore = create<Store>((set, get) => ({
    todos: {},
    date: getSupabaseDateString(new Date()),
    setTodos: (category: string, todos: TODO[]) => set((state) => {
        const _todos = { ...state.todos };
        _todos[category] = todos;
        return { todos: _todos };
    }),
    setSession: (session) => set((_) => ({ session })),
    fetchTodos: async (category: string) => {
        const date = get().date;
        const { data, error } = await supabase
            .from("todos")
            .select("*")
            .eq("category", category)
            .eq("created_at", date)
            .order("order_id");
        if (!error) {
            set((state) => {
                const _todos = { ...state.todos };
                _todos[category] = data;
                return { todos: _todos };
            })
        }
    },
    clean_todos: () => set((_) => ({ todos: {} })),
    setDate: (date: Date) => set((_) => ({ date: getSupabaseDateString(date) }))
}))
