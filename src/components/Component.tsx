import { useStore } from '@/utils/store';
import supabase from '@/utils/supabase';
import { LexoRank } from 'lexorank';
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow';
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
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface ComponentProps {
    category: string,
    bg_color: string,
    overlay_color: string
}

const Component = (props: ComponentProps) => {
    const [open, setOpen] = useState(false);
    const [todo, setTodo] = useState<string>();
    const [session, date, todos, fetchTodos] = useStore(useShallow((state) => [state.session, state.date, state.todos[props.category], state.fetchTodos]))
    
    useEffect(() => {
        fetchTodos(props.category);
    }, [date])
    
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
                category: "do",
                order_id: order_id.toString(),
                created_at: date
            });
            setTodo("");
            await fetchTodos(props.category);
            setOpen(false);
        }
    }

    return (
        <div className={props.bg_color}>
            <div className={'flex px-2 justify-between m-2 rounded ' + props.overlay_color}>
                <h2 className='text-xl'>{props.category.toUpperCase()}</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button>
                            <FaPlus />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{props.category.toUpperCase()}</DialogTitle>
                            <DialogDescription>Add the tasks which you need to complete</DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="todo" className="sr-only">
                                    Link
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
            <Droppable droppableId={props.category}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className='m-2'>
                        {todos && todos.map((todo, idx) => (
                            <Draggable key={todo.id} draggableId={todo.id.toString()} index={idx}>
                                {(provided) => {
                                    return (
                                        <div className={'mb-2 p-1 rounded ' + props.overlay_color} {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
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

export default Component
