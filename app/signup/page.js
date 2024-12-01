"use client";
import React, { useState } from "react";

const SignUpPage = () => {
  const [userCreds, setUserCreds] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newAdminDetails, setNewAdminDetails] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCreds((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const onSubmit = async () => {
    if (!userCreds.username || !userCreds.password || !userCreds.role) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(userCreds),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("User created successfully!");
      } else if (res.status === 409 && data.message.includes("admin")) {
        // Admin conflict detected, ask for confirmation
        setErrorMessage(data.message);
        setShowConfirmation(true);
        setNewAdminDetails(userCreds); // Save admin details for confirmation
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Server error, please try again later.");
    }
  };

  // Handle admin replacement confirmation
  const handleAdminReplacement = async (confirm) => {
    if (!confirm) {
      setShowConfirmation(false);
      return; // User canceled replacement
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ ...newAdminDetails, confirm: true }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Admin replaced successfully!");
      } else {
        alert(data.message || "Error replacing admin");
      }
    } catch (error) {
      console.error("Error replacing admin:", error);
      alert("Server error, please try again later.");
    } finally {
      setShowConfirmation(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-start items-center gap-y-6 p-8 w-2/5 mx-auto my-20">
      <h1 className="signinElement underline decoration-red-600">Sign Up</h1>
      <input
        className="signinElement"
        type="text"
        name="username"
        placeholder="Username"
        value={userCreds.username}
        onChange={handleChange}
      />
      <input
        className="signinElement"
        type="password"
        name="password"
        placeholder="Password"
        value={userCreds.password}
        onChange={handleChange}
      />
      <select
        className="signinElement"
        name="role"
        value={userCreds.role}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select Role
        </option>
        <option>Normal User</option>
        <option>Admin</option>
      </select>
      <button className='signinElement border-[1px] border-black font-medium text-lg' onClick={onSubmit}>
        Sign Up
      </button>

      {showConfirmation && (
        <div className="confirmation-modal">
          <p>{errorMessage}</p>
          <button
            className="btn-yes bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => handleAdminReplacement(true)}
          >
            Yes
          </button>
          <button
            className="btn-no bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => handleAdminReplacement(false)}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
