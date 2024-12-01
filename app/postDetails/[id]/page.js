'use client'
import React, { useState, useEffect } from "react";
import PostDetails from "@/app/componenets/PostDetails";
import { useParams } from "next/navigation";

import { useRouter } from 'next/navigation'; 

const Page = () => {
    const { id: postID } = useParams(); 
    const [post, setPost] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [deleted, setDeleted] = useState(false);

  const router = useRouter(); 

  useEffect(() => {
    if (!postID) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/${postID}`,{
            method:"GET",
            headers:{
                "content-Type": "application/json"
            }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await response.json();
        setPost(data); 
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postID]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>No post found</div>;
  }




  const openPopUpDelete = () => {
    setIsOpen(true);
  };
  const closePopup = () => setIsOpen(false);

  const handleDelete = async () => {
    console.log("Delete BTN Clicked");
    setIsOpen(true);
    try {
      const response = await fetch(`/api/post/${postID}`, {
        method: "DELETE",
        // body: JSON.stringify({ postID }), // Ensure you're passing the correct ID
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        router.push('/'); // Redirect to home page after deletion

        console.log("Item deleted successfully");
        // Optionally, you can trigger a state update or UI refresh here
        setDeleted(true);
      } else {
        console.error("Failed to delete item:", data.error);
      }
    } catch (error) {
      console.error("Error deleting item:");
    }
  };

 
 
      // Conditional rendering to show success message
      if (deleted) {
            return <div className="text-red-400">Item deleted successfully.</div>;

      }
    

      const handleEdit = () =>{
        router.push(`/EditPost/${postID}`)
      }
  

  console.log("the post is : ",post);
  return (
    <article className=" w-3/6 h-screen  bg-white p-2 rounded-[1rem] pb-8 mb-10  cursor-default transition hover: shadow-lg mx-auto items-center justify-center overflow-auto">

{isOpen && (
        <>
          <div
            tabIndex="0"
            className="fixed inset-0 bg-gray-900 bg-opacity-40 z-40 o"
          >
            {/* Your overlay content */}
          </div>

          {/* Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="">
        <div className="flex justify-end gap-4">
          <button onClick={handleEdit} className=" bg-slate-300 rounded-lg px-3 font-medium  text-white" >Edit</button>
          <button onClick={openPopUpDelete} className="bg-red-800 rounded-lg px-3 font-medium text-teal-50">Delete</button>
        </div>

        <div className=" flex  items-center justify-center">
        <h3 className="mx-0 my-4 font-semibold overflow-auto underline text-4xl mb-10">{post.Heading}</h3>
      </div>
        <img
          className=" mx-auto place-items-center rounded-[1rem] overflow-hidden w-10/12"
          src={post.Thumbnail}
          alt={"heading"}
        />

        <div className=" flex justify-center items-center ">
          <p className="mt-6  overflow-hidden w-10/12"> {post.Content}</p>
        </div>
      
      </div>
    </article>
  );
};

export default Page;
