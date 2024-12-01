"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'; 


const page = () => {
  const [error, setError] = useState('');  

  const router =useRouter();
    const [userCreds, setUserCreds] = useState({
        username: '' ,
        password:'' ,
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserCreds(prevState => ({
          ...prevState,
          [name]: value
        }));
        console.log(userCreds);
      };

      const onSubmit = async (e) => {
        e.preventDefault();

        if (!userCreds.username || !userCreds.password ) {
          alert("All fields are required!");
          return;
        }
        try {
        const res =await fetch("/api/auth/signin", {
          method: "POST",
          body: JSON.stringify(userCreds),
          headers: {
            "content-type": "application/json",
          },
        });
        console.log("Object as a string:", JSON.stringify(userCreds));
        const data = await res.json(); // Parse JSON response from the server
console.log( "the data is ",data);
        if (res.ok) {

          console.log("Sign-in successful!");
          if (data.role === 'Admin') {
            window.location.href = '/adminDashboard'; 
          } else {
            window.location.href = '/'; 
          }

        } else {

          setError(data.message || 'Something went wrong, please try again!');
          console.log(data.message);
          alert("User not Found");
        }
      } catch (error) {

        console.error("Error during sign-in:", error);
        setError('Server error, please try again later');
      }
      }
    
  return (
    <div className='grid grid-cols-1 justify-start items-center gap-y-6 p-8 w-2/5 mx-auto my-20'>
        <h1 className='signinElement underline decoration-red-600'>Sign In</h1>
        <input className='signinElement ' type='text' name='username' placeholder='UserName' value={userCreds.username} onChange={handleChange}></input>
        <input className='signinElement ' type='password' name='password' placeholder='password' value={userCreds.password} onChange={handleChange}></input>
       
       
        <button className='signinElement border-[1px] border-black font-medium text-lg' onClick={onSubmit}>Sign In</button>

    
    </div>
  )
}

export default page