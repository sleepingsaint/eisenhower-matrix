import { Calendar } from '@/components/ui/calendar'
import { useStore } from '@/utils/store'
import { useShallow } from 'zustand/shallow'

const Sidebar = () => {
    const [date, setDate] = useStore(useShallow(state => [state.date, state.setDate]))
    return (
        <div className='px-4 pt-8 shadow-xl'>
            <Calendar
                mode="single"
                selected={new Date(date)}
                onSelect={(_, date, __) => setDate(date)}
                className="rounded-md border"
            />
        </div>
    )
}

export default Sidebar
