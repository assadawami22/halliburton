'use client';

import Link from "next/link";
import React from "react";

import { useRouter } from 'next/navigation';
const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (res.ok) {
        alert('Logged out successfully');
        router.push('/signin'); // Redirect to Sign In page
      } else {
        alert('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout');
    }
  };
  return (
    <div className="flex  items-center justify-between mx-auto bg-white mb-4">
      <div className="flex items-center justify-start gap-x-8">
        <Link href={"/"}>
          {" "}
          <img src="/Logo.jpg" className=" w-40" />
        </Link>
        <Link className="text-lg font-medium underline decoration-red-600" href={"/createPost"}>Create Post </Link>

      </div>
      <div className="flex gap-5  items-center justify-end  mx-8">
      

        <Link className=" underline decoration-red-600" href={"/signin"}>Sing In </Link>
        <Link className=" underline decoration-red-600" href={"/signup"}>Sing Up </Link>
        <Link className=" underline decoration-red-600" onClick={handleLogout} href={"/signup"}>Sing Out </Link>
        {/* <Link href={"/profile"}>Profile </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
