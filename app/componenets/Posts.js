"use client"; 
import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPosts, setSelectedPosts] = useState([]);
const [exportTrigger, setExportTriger] = useState(false);
  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/post");
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        setPosts(data); // Set the fetched posts to state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!loading && posts.length === 0) {
    return <div>No posts found for your account.</div>;
  }


  //File Export Managment #################################################################

  const exportTriggerHandle = ()=>{
    setExportTriger(!exportTrigger);
  }
  const handlePostSelection = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId) // Deselect the post
        : [...prev, postId] // Select the post
    );
  };

  const handleExport = async () => {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postIds: selectedPosts }), // Pass selected post IDs
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'posts.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert('Failed to export posts.');
    }
  };

  const handleExportAll = async () => {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postIds: [] }), 
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'posts.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert('Failed to export posts.');
    }
  };



  return (
    <section className=" ">

<div className="flex justify-end my-5">
  <button
    className="rounded-lg border-[1px] border-gray-500 px-4 py-2"
    onClick={exportTriggerHandle}
  >
    Export
  </button>
</div>
{ exportTrigger  &&    <div>
      <h2>Select Posts to Export</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <input
              type="checkbox"
              checked={selectedPosts.includes(post.id)}
              onChange={() => handlePostSelection(post.id)}
            />
            {post.Heading} 
          </li>
        ))}
      </ul>

      <button onClick={handleExport}>Export Selected Posts</button>
      <button onClick={handleExportAll}>Export All Posts</button>
    </div>}
      <div className=" container grid grid-cols-3 gap-16">
         {posts.map((post) => (

        <PostItem
          key={post.id}
          postID={post.id}
          thumbnail={post.Thumbnail}
          content={post.Content}
          heading={post.Heading}
          restricted={post.restrected}
        />
        
      ))}

      </div>
    </section>
  );
};

export default Posts;
