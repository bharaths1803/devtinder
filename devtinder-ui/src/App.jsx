import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./_components/Navbar";
import Body from "./_components/Body";
import Login from "./_components/Login";
import Profile from "./_components/Profile";
import store from "./utils/appStore.js";
import { Provider } from "react-redux";
import Feed from "./_components/Feed.jsx";
import Connections from "./_components/Connections.jsx";
import Requests from "./_components/Requests.jsx";
import Chat from "./_components/Chat.jsx";
import Pricing from "./_components/Pricing.jsx";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat/:toUserId" element={<Chat />} />
              <Route path="/premium" element={<Pricing />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
