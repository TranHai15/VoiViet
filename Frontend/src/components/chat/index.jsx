import { useContext, useEffect } from "react";
import ChatBoxConTent from "./page/ChatBox";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import "./style.css";
import { ChatContext } from "../../contexts/ChatContext";
import { AuthContext } from "../../contexts/AuthContext";
export default function Chat() {
  const { isSidebar } = useContext(ChatContext);
  const { isLogin, isRole, Navigate, Location } = useContext(AuthContext);
  useEffect(() => {
    if (isLogin && isRole !== null) {
      return;
    } else {
      Navigate("/login");
    }
  }, [Location.pathname]);
  return (
    <div>
      <div className="containers">
        {isSidebar && (
          <div className="sidebar">
            <Sidebar />
          </div>
        )}
        <div className="content">
          <header>
            <Header />
          </header>
          <main>
            <ChatBoxConTent />
          </main>
        </div>
      </div>
    </div>
  );
}
