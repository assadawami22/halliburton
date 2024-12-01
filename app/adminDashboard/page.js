import Image from "next/image";
import AdminPosts from "../componenets/AdminPosts";

export default function Page() {
  return (
    <div className=" container">
      <h1 className=" underline"> <span className="text-red-600">Admin</span> Dashboard</h1>
    <AdminPosts />
    </div>
  );
}
