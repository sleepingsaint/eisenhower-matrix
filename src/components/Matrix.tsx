import { LexoRank } from 'lexorank'
import { useShallow } from 'zustand/react/shallow';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

import supabase from '@/utils/supabase';
import { useStore } from '@/utils/store';
import Component from '@/components/Component';

const Matrix = () => {
    const [todos, fetchTodos] = useStore(useShallow((state) => [state.todos, state.fetchTodos]))

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
    return <div className='bg-slate-400 grid grid-rows-2 grid-cols-2 aspect-square sm:w-3/4 2xl:w-1/2  m-auto inset-0 absolute'>
        <DragDropContext onDragEnd={onDragEnd}>
            <Component category='do' bg_color='bg-do' overlay_color='bg-doOverlay' />
            <Component category='delegate' bg_color='bg-delegate' overlay_color='bg-delegateOverlay'/>
            <Component category='schedule' bg_color='bg-schedule' overlay_color='bg-scheduleOverlay'/>
            <Component category='delete' bg_color='bg-delete' overlay_color='bg-deleteOverlay'/>
        </DragDropContext>
    </div>
}
export default Matrix
