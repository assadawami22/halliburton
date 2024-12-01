import Link from "next/link";
import React from "react";
import { FcBookmark } from "react-icons/fc";

const PostItem = ({ heading, content, thumbnail, postID, restricted }) => {
  console.log("show restricted or not:", restricted);
  const shortContent =
    content.length > 145 ? content.substr(0, 145) + "..." : content;
  return (
    <article className=" bg-white p-4 rounded-[2rem] pb-20 cursor-default transition hover: shadow-lg">
      <div className="">
        <img
          className=" rounded-[2rem] overflow-hidden h-64"
          src={thumbnail}
          alt={"heading"}
        />

        <div className="">
          <Link href={`/postDetails/${postID}`}>
            <div className="flex justify-between items-center">
              <h3 className="mx-0 my-4 font-semibold overflow-auto underline decoration-red-500">
                {heading}
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
            <p className="mt-6  overflow-hidden"> {shortContent}</p>
          </Link>
        </div>
      </div>
    </article>
  );
};
export default PostItem;
