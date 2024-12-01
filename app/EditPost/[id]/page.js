'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; 
import { useParams } from "next/navigation"; 

const Page = () => {
  const router = useRouter(); 
  const { id: postID } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [postData, setPostData] = useState({
    Thumbnail: '',
    Heading: '',
    Content: '',
    Attachments: '',
    restrected: false,
    userID: '', 
  });

  ////// Start Update fetch Function ##########################################################
  
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/post/${postID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Post Updated successfully!');
      router.push("/")
    } else {
      alert(`Error: ${data.message}`);
    }
  };



    // ####################################################### End Update fetch Function ###



      ////// Start GET fetch Function ##########################################################

  useEffect(() => {

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
        setPostData(data); // Set the fetched post to state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postID]); // Re-run the effe
  console.log("the post data inside Edit Page",postData);



      // ####################################################### End GET fetch Function ###


  return (
    <form className=' flex flex-col flex-1 justify-start items-center gap-y-6 p-8 w-2/5 mx-auto' onSubmit={handleSubmit}>

      <h1 className='my-6 underline'>
        Edit your Post
      </h1>
      <input className='craetePostElements'
        type="text"
        name="Thumbnail"
        value={postData.Thumbnail}
        onChange={handleChange}
        placeholder="Thumbnail URL"

      /> 
      <input className='craetePostElements '
        type="text"
        name="Heading"
        value={postData.Heading}
        onChange={handleChange}
        placeholder="Heading"
      /> 
      <textarea className='craetePostElements'
        name="Content"
        value={postData.Content}
        onChange={handleChange}
        placeholder="Content"
      />
      <input className='craetePostElements'
        type="text"
        name="Attachments"
        value={postData.Attachments}
        onChange={handleChange}
        placeholder="Attachments URL"
      />
      <label className='craetePostElements'>
        Restricted:
        <input className=''
          type="checkbox"
          name="restrected"
          checked={postData.restrected}
          onChange={(e) => setPostData({ ...postData, restrected: e.target.checked })}
        />
      </label>
      <button className=' craetePostElements btn border-[1px] hover:text-blue-400 border-black text-xl font-semibold' type="submit">Update Post</button>
    </form>
  );
}

export default Page