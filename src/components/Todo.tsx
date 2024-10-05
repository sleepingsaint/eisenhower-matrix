import React, { useEffect, useState } from 'react'
import supabase from '../utils/supabase'

function Todo() {
    
  
    return (
      <div>
        <button onClick={() => {
            supabase.auth.signInWithOAuth({
                provider: "google"
            })
        }}>Sign In with google</button>
        <p>{}</p>


        {todos.map((todo) => (
          <li key={todo.id}>{todo.todo}</li>
        ))}
      </div>
    )
  }

export default Todo

