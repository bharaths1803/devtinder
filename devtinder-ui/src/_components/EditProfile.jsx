import React, { useState } from "react";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { Navigate, useNavigate } from "react-router-dom";

const EditProfile = ({ user }) => {
  const dispactch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [toast, showToast] = useState(false);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [about, setAbout] = useState(user.about || "");
  const [age, setAge] = useState(user.age || 18);
  const [gender, setGender] = useState(user.gender || "");

  const handleSaveProfile = async () => {
    try {
      setError("");
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, about, age, gender },
        {
          withCredentials: true,
        }
      );
      showToast(true);
      setTimeout(() => {
        showToast(false);
        navigate("/");
      }, 3000);

      dispactch(addUser(res.data.data));
    } catch (error) {
      setError(error.response.data);
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center my-2">
        <div className="flex justify-center gap-10">
          <div className="card bg-base-300 w-96 shadow-sm max-h-[80vh] overflow-y-auto">
            <div className="card-body">
              <h2 className="card-title flex justify-center">Edit Profile</h2>
              <div className="space-y-2">
                <div className="">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    placeholder="Bharath"
                    className="input input-md"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="">
                  <legend className="fieldset-legend">Last name</legend>
                  <input
                    type="text"
                    placeholder="Seshadri"
                    className="input input-md"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="">
                  <legend className="fieldset-legend">Age</legend>
                  <input
                    type="number"
                    className="input input-md"
                    value={age}
                    min={18}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="">
                  <legend className="fieldset-legend">Photo Url</legend>
                  <input
                    type="url"
                    placeholder="https://i.pinimg.com/originals/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.webp"
                    className="input input-md"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Gender</legend>
                  <select
                    value={gender}
                    className="select"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value={"Select Gender"} disabled={true}>
                      Select Gender
                    </option>
                    <option value={"male"}>Male</option>
                    <option value={"female"}>Female</option>
                    <option value={"others"}>Others</option>
                  </select>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">About</legend>
                  <textarea
                    className="textarea h-24"
                    placeholder={about}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  ></textarea>
                </fieldset>
              </div>
              <p className="text-red-600">{error}</p>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-primary m-2"
                  onClick={handleSaveProfile}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about }}
          />
        </div>
      </div>
      {toast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile Updated Successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
