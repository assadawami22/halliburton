"use client";
import React, { useState, useEffect } from "react";
import { FcBookmark } from 'react-icons/fc';

const PostDetails = ({ heading, content, thumbnail, postID, restricted }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/${postID}`);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data); 
        setLoading(false); 
        console.log(data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postID]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <article className=" h-screen w-10/12 bg-white p-4 rounded-[1rem] pb-8 cursor-default transition hover: shadow-lg">
      <div className="">
        <div className="flex justify-end gap-4">
          <button className=" bg-slate-300 rounded-lg px-3 font-medium  text-white">
            Edit
          </button>
          <button className="bg-red-800 rounded-lg px-3 font-medium text-teal-50">
            Delete
          </button>
        </div>

        <div className="flex justify-between items-center ">
          <h3 className="mx-0 my-4 font-semibold overflow-auto">
            {posts.heading}
          </h3>

          {restricted && (
            <div className="relative group">
              <FcBookmark className="text-4xl" />
              {/* Custom tooltip */}
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm rounded px-3 py-1 whitespace-nowrap">
                This post contains restricted words
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <img
          className=" rounded-[2rem] overflow-hidden h-64"
          src={thumbnail}
          alt={"heading"}
        />

        <div className="">
          <p className="mt-6  overflow-hidden"> {content}</p>
        </div>
      </div>
    </article>
  );
};

export default PostDetails;
