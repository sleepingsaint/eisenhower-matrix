import { useStore } from "@/utils/store";
import { useEffect } from "react";
import { useShallow } from 'zustand/shallow'
import supabase from '@/utils/supabase'
import { Button } from "@/components/ui/button"

const Navbar = () => {
    const [session, setSession] = useStore(useShallow((state) => [state.session, state.setSession]));

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session)
            }
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                console.log("session changed")
                setSession(session)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google"
        })
        const data = await supabase.auth.getSession();
        if (data && data['data'] && data['data']['session']) {
            setSession(data['data']['session']);
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(undefined);
    }

    return (
        <div className='flex justify-between p-4 shadow-xl'>
            <h1 className='text-xl'>Eisenhower Matrix</h1>
            <div className='pr-4 group relative'>
                {session ? <div>
                    <span>{session.user.user_metadata.name}</span>
                    <Button className="ml-4" onClick={signOut}>Logout</Button>
                </div> : <div>
                    <Button onClick={signIn}>Login</Button>
                </div>}
            </div>
        </div>
    )
}

export default Navbar