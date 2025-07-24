import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";

const Requests = () => {
  const dispactch = useDispatch();
  const requests = useSelector((state) => state.requests);

  const [showButtons, setShowButtons] = useState(true);

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispactch(addRequests(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  const reviewRequest = async (requestId, status) => {
    try {
      setShowButtons(false);
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispactch(removeRequest(requestId));
    } catch (err) {
      console.log(err.respone.data);
    } finally {
      setShowButtons(true);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return <h1 className="my-10 flex justify-center">No Requests Found</h1>;

  return (
    <div className="my-10 text-center">
      <h1 className="text-3xl text-white font-bold">Connection Requests</h1>
      {requests.map((request, idx) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;
        return (
          <div
            key={request._id}
            className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between p-4 m-4 bg-base-300 rounded-lg w-11/12 sm:w-1/2 mx-auto space-y-2 sm:space-y-0"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {" "}
              <div className="">
                <img
                  src={photoUrl}
                  alt="User image"
                  className="aspect-square object-cover rounded-full"
                  width={40}
                  height={40}
                />
              </div>
              <div className="sm:text-left">
                <h2 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && <p>{age + ", " + gender}</p>}
                <p>{about}</p>
              </div>
            </div>

            {showButtons && (
              <div className="card-actions justify-center">
                <button
                  className="btn btn-primary"
                  onClick={() => reviewRequest(request._id, "rejected")}
                >
                  Reject
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => reviewRequest(request._id, "accepted")}
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
