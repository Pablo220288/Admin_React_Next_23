import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Link from "next/link";

function AdminSettings({ swal }) {
  const [adminEmails, setAdminEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState(null);
  const [editedEmail, setEditedEmail] = useState(null);
  const [formVisibility, setFormVisibility] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    axios.get("/api/settings").then((result) => {
      setAdminEmails(result.data);
    });
  };

  const addNewEmail = () => {
    setEditedEmail(null);
    setFormVisibility("email");
    setNewEmail("email");
    setEmail("");
  };

  const editEmail = (admin) => {
    setNewEmail(null);
    setFormVisibility(admin);
    setEditedEmail(admin);
    setEmail(admin.email);
  };

  const saveAdminEmail = async (ev) => {
    ev.preventDefault();
    const data = {
      email,
    };
    if (editedEmail) {
      // Update
      data._id = editedEmail._id;
      await axios.put("/api/settings", data);
      setEditedEmail(null);
    } else {
      // Create Admin
      await axios.post("/api/settings", data);
    }
    setFormVisibility(null);
    setNewEmail(null);
    setEmail("");
    fetchAdmins();
  };

  const deleteAdmin = (admin) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do tou want delete ${admin.email}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = admin;
          await axios.delete("/api/settings?_id=" + _id);
          fetchAdmins();
        }
      });
  };

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm">
        <Link className="hover:text-black" href={"/settings"}>
          Settings{" "}
        </Link>
        <span>\ </span>
        <span className="text-black">Admin Configuration</span>
      </div>
      <button
        className="bg-blue-800 rounded-md text-white py-2 px-4
        hover:bg-blue-900 transition ease-in-out duration-150
        disabled:bg-gray-400"
        onClick={() => {
          addNewEmail();
        }}
        disabled={editedEmail && true}
      >
        Add new Admin
      </button>
      {formVisibility && (
        <form className="my-4" onSubmit={saveAdminEmail}>
          <label>{newEmail ? "Email new Admin" : "Edit email Admin"}</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="m-0"
              placeholder="Email"
              defaultValue={email}
              onChange={(ev) => {
                setEmail(ev.target.value);
              }}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
            <button
              type="button"
              onClick={() => {
                setFormVisibility(null);
                setNewEmail(null);
                setEditedEmail(null);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Admin email</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {adminEmails.map((admin) => (
            <tr key={admin._id}>
              <td className="py-3">{admin.email}</td>
              {!newEmail && !editedEmail && (
                <td>
                  <div className="flex gap-1 justify-center mt-2">
                    <button
                      type="button"
                      className="btn-category"
                      onClick={() => {
                        editEmail(admin);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      <span className="hidden md:flex">Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn-category delete"
                      onClick={() => {
                        deleteAdmin(admin);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      <span className="hidden md:flex">Delete</span>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <AdminSettings swal={swal} />);
