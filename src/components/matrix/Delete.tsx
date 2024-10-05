import { useEffect, useState } from 'react'
import { useStore, type TODO } from '@/utils/store';
import { useShallow } from 'zustand/react/shallow';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import supabase from '@/utils/supabase';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { FaCheck, FaPlus } from 'react-icons/fa6';
import { LexoRank } from 'lexorank';

const getTodos = async () => {
    const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("category", "delete")
        .order("order_id");
    if (!error) {
        return data as TODO[];
    }
    return [];
}

const Delete = () => {
    const [open, setOpen] = useState(false);
    const [todo, setTodo] = useState<string>();

    const [session, todos, setTodos] = useStore(useShallow((state) => [state.session, state.delete_todos, state.set_delete_todos]));

    useEffect(() => {
        async function _getTodos() {
            const _todos = await getTodos();
            setTodos(_todos);
        }
        _getTodos();
    }, [])

    const addTodo = async () => {
        if (session && todo && todo.length > 0) {
            let order_id = LexoRank.middle();
            if (todos.length > 0) {
                let _last_order_id = LexoRank.parse(todos[todos.length - 1].order_id);
                order_id = _last_order_id.genNext();
            }
            await supabase.from("todos").insert({
                todo,
                user_id: session?.user.id,
                category: "delete",
                order_id: order_id.toString()
            });
            setTodo("");
            const _todos = await getTodos();
            setTodos(_todos);
            setOpen(false);
        }
    }

    return (
        <div className='bg-delete'>
                <div className='flex px-2 justify-between bg-deleteOverlay m-2 rounded'>
                <h2 className='text-xl'>Delete</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button>
                            <FaPlus />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Tasks</DialogTitle>
                            <DialogDescription>Add the tasks which you need to delete</DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="todo" className="sr-only">
                                   Title 
                                </Label>
                                <Input
                                    id="todo"
                                    value={todo}
                                    onChange={e => setTodo(e.target.value)}
                                />
                            </div>
                            <Button onClick={addTodo}><FaCheck /></Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <Droppable droppableId='delete'>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className='m-2'>
                        {todos.map((todo, idx) => (
                            <Draggable key={todo.id} draggableId={todo.id.toString()} index={idx}>
                                {(provided) => {
                                    return (
                                        <div className='mb-2 rounded p-1 bg-deleteOverlay' {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                            {todo.todo}
                                        </div>
                                    )
                                }}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>

    )
}

export default Delete
