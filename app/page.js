import Image from "next/image";
import Posts from "./componenets/Posts";
export default function Home() {
  return (
    <div className=" container">
      <h1 className="underline decoration-red-600">  <span className=" text-red-600 ">Home</span>  Page</h1>
    <Posts />
    </div>
  );
}
