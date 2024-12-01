"use client"; 

import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false); // New state for toggling
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [exportTrigger, setExportTrigger] = useState(false);

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/adminDashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data); // Set the fetched posts to state
        setFilteredPosts(data); // Initially show all posts
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  const handleShowFlaggedOnly = () => {
    setShowFlaggedOnly(!showFlaggedOnly); // Toggle the filter state
    if (!showFlaggedOnly) {
      // Show only restricted posts
      setFilteredPosts(posts.filter((post) => post.restrected));
    } else {
      // Show all posts
      setFilteredPosts(posts);
    }
  };

  const exportTriggerHandle = () => {
    setExportTrigger(!exportTrigger);
  };

  const handlePostSelection = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId) // Deselect the post
        : [...prev, postId] // Select the post
    );
  };

  const handleExport = async () => {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postIds: selectedPosts }), // Pass selected post IDs
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "posts.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert("Failed to export posts.");
    }
  };

  const handleExportAll = async () => {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postIds: [] }), // Empty array means export all posts
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "posts.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert("Failed to export posts.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!loading && posts.length === 0) {
    return <div>No posts found for your account.</div>;
  }

  return (
    <section className=" ">
      <div className="flex items-center justify-between my-8 mx-2">
        <button
          className="rounded-lg text-red-600 border-[1px] border-red-600 px-4 py-2"
          onClick={handleShowFlaggedOnly}
        >
          {showFlaggedOnly ? "Show All Posts" : `Show Only Posts with Restricted Flag: ${filteredPosts.length}`}
        </button>
        <button
          className="rounded-lg border-[1px] border-gray-500 px-4 py-2"
          onClick={exportTriggerHandle}
        >
          Export
        </button>
      </div>
      {exportTrigger && (
        <div>
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
        </div>
      )}
      <div className="container grid grid-cols-3 gap-16">
        {filteredPosts.map((post) => (
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

export default AdminPosts;
