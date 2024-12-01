'use client';
import { useRouter } from 'next/navigation'; 
import React, { useState } from 'react';

const Page = () => {
  const router = useRouter(); 

  const [warning, setWarning] = useState(''); 
  const [postData, setPostData] = useState({
    Thumbnail: '',
    Heading: '',
    Content: '',
    Attachments: '',
    restrected: false,
    userID: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPostData((prev) => {
      const updatedData = { ...prev, [name]: value };

      // Regex to detect restricted words
      const restrictedWordsRegex = /\b[A-Z][a-zA-Z]*[A-Z]\b/;

      // Check if Heading or Content contains restricted words
      const hasRestrictedWords =
        restrictedWordsRegex.test(updatedData.Heading) ||
        restrictedWordsRegex.test(updatedData.Content);

      return { ...updatedData, restrected: hasRestrictedWords };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (postData.restrected) {
      setWarning('Your post contains restricted words. It will still be saved.');
    } else {
      setWarning('');
    }

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('Post created successfully!');
        router.push('/');
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  return (
    <form
      className="flex flex-col flex-1 justify-start items-center gap-y-6 p-8 w-2/5 mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="my-6 underline decoration-red-600">Create your Post</h1>

      {warning && <p className="text-red-500">{warning}</p>}

      <input
        className="craetePostElements"
        type="text"
        name="Thumbnail"
        value={postData.Thumbnail}
        onChange={handleChange}
        placeholder="Thumbnail URL"
      />
      <input
        className="craetePostElements"
        type="text"
        name="Heading"
        value={postData.Heading}
        onChange={handleChange}
        placeholder="Heading"
      />
      <textarea
        className="craetePostElements"
        name="Content"
        value={postData.Content}
        onChange={handleChange}
        placeholder="Content"
      />
      <input
        className="craetePostElements"
        type="text"
        name="Attachments"
        value={postData.Attachments}
        onChange={handleChange}
        placeholder="Attachments URL"
      />
      <label className="craetePostElements">
        Restricted:
        <input
          className=""
          type="checkbox"
          name="restrected"
          checked={postData.restrected}
          readOnly
        />
      </label>
      <button
        className="craetePostElements btn border-[1px] hover:text-blue-400 border-black text-xl font-semibold"
        type="submit"
      >
        Create Post
      </button>
    </form>
  );
};

export default Page;
