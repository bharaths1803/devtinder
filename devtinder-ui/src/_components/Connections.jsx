import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispactch = useDispatch();
  const connections = useSelector((state) => state.connections);
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispactch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return <h1 className="my-10 flex justify-center">No Connections Found</h1>;

  return (
    <div className="my-10 text-center">
      <h1 className="text-3xl text-white font-bold">Connections</h1>
      {connections.map((connection, idx) => {
        return (
          <div
            key={connection._id}
            className="flex items-center sm:items-start flex-col sm:flex-row gap-4 p-4 m-4 bg-base-300 rounded-lg w-11/12 sm:w-1/2 mx-auto"
          >
            <div>
              <img
                src={connection.photoUrl}
                alt="User image"
                className="aspect-square object-cover rounded-full"
                width={40}
                height={40}
              />
            </div>
            <div className="sm:text-left">
              <h2 className="font-bold text-xl">
                {connection.firstName + " " + connection.lastName}
              </h2>
              {connection.age && connection.gender && (
                <p>{connection.age + ", " + connection.gender}</p>
              )}
              <p>{connection.about}</p>
            </div>
            <Link to={"/chat/" + connection._id}>
              <button className="btn btn-primary m-2">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
