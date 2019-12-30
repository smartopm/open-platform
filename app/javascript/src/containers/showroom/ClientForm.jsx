import React from 'react'
import { useForm } from " react-hook-form"

// Name
// Surname
// NRC
// Contact information
// Phone number
// Preferred email
// Mailing address
// Reason for Visit
// How did You Learn About Nkwashi (drop down)


export default function ClientForm(){
    const {register, handleSubmit, errors} = useForm()
    const onSubmit = data => console.log(data)

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input name="example" defaultValue="test" ref={register} />
        </form>
    )
}