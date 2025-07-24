import React, { useState } from "react";
import { removeFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";

const UserCard = ({ user }) => {
  const dispactch = useDispatch();

  const [showButtons, setShowButtons] = useState(true);

  const sendRequest = async (userId, status) => {
    try {
      setShowButtons(false);
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispactch(removeFeed(userId));
    } catch (err) {
      console.log(err.respone.data);
    } finally {
      setShowButtons(true);
    }
  };

  return (
    <>
      <div className="card bg-base-300 w-96 shadow-sm h-[80vh] overflow-y-auto">
        <figure>
          <img src={user.photoUrl} alt="User image" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{user.firstName + " " + user.lastName}</h2>
          {user.age && user.gender && <p>{user.age + ", " + user.gender}</p>}

          <p className="max-h-[5vh] overflow-y-auto">{user.about}</p>
          {showButtons && (
            <div className="card-actions justify-center">
              <button
                className="btn btn-primary"
                onClick={() => sendRequest(user._id, "ignored")}
              >
                Ignore
              </button>
              <button
                className="btn btn-primary"
                onClick={() => sendRequest(user._id, "interested")}
              >
                Interested
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserCard;
