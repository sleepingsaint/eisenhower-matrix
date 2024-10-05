import { LexoRank } from 'lexorank'
import { useShallow } from 'zustand/react/shallow';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

import supabase from '@/utils/supabase';
import { useStore, type TODO } from '@/utils/store';
import Do from '@/components/matrix/Do';
import Delegate from '@/components/matrix/Delegate';
import Schedule from '@/components/matrix/Schedule';
import Delete from '@/components/matrix/Delete';


const Matrix = () => {
    const todos: Record<string, TODO[]> = useStore(useShallow((state) => ({
        do: state.do_todos,
        delegate: state.delegate_todos,
        schedule: state.schedule_todos,
        delete: state.delete_todos
    })))
    const fetchTodos = useStore(useShallow((state) => state.fetch_todos));

    const onDragEnd = async (res: DropResult) => {
        if (res.destination) {
            if (todos[res.destination.droppableId].length > 0) {
                let _newId;
                if (res.destination.index == 0) {
                    let _currId = LexoRank.parse(todos[res.destination.droppableId][res.destination.index].order_id);
                    _newId = _currId.genPrev();
                } else if (res.destination.index == todos[res.destination.droppableId].length) {
                    let _currId = LexoRank.parse(todos[res.destination.droppableId][res.destination.index - 1].order_id);
                    _newId = _currId.genNext();
                } else {
                    let _prevId, _nextId;
                    _prevId = LexoRank.parse(todos[res.destination.droppableId][res.destination.index - 1].order_id);
                    _nextId = LexoRank.parse(todos[res.destination.droppableId][res.destination.index].order_id);
                    _newId = _prevId.between(_nextId);
                }
                await supabase.from("todos").update({
                    order_id: _newId.toString(),
                    category: res.destination.droppableId
                }).eq('id', res.draggableId);

            } else {
                await supabase.from("todos").update({
                    order_id: LexoRank.middle().toString(),
                    category: res.destination.droppableId
                }).eq("id", res.draggableId)
            }
            fetchTodos(res.destination.droppableId);
            if(res.source.droppableId != res.destination.droppableId){
                fetchTodos(res.source.droppableId);
            }
        }
    }
    return <div className='grid grid-rows-2 grid-cols-2 aspect-square w-1/3 m-auto inset-0 absolute'>
        <DragDropContext onDragEnd={onDragEnd}>
            <Do />
            <Delegate />
            <Schedule />
            <Delete />
        </DragDropContext>
    </div>
}
export default Matrix
