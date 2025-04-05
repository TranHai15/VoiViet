import { NavLink } from "react-router-dom";
import "./style.css";
import { ChatContext } from "../../../../contexts/ChatContext";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import axiosClient from "../../../../api/axiosClient";
export default function Sidebar() {
  const [HistoryChat, setHistoryChat] = useState([]);
  const [NewChatTest, setNewChatTest] = useState([]);
  const { isLogin, isRole, Navigate, Location } = useContext(AuthContext);
  const { setIsSidebar, SetMessagesChat } = useContext(ChatContext);
  const existingRoomId = Location.pathname;
  const tachchuoi = existingRoomId.split("/");

  const cuoichuoi = tachchuoi[2];

  const redirectToLogin = () => {
    Navigate("/login");
  };
  const newChat = () => {
    SetMessagesChat([]);
    Navigate("/");
  };
  const getOneChat = async (id) => {
    try {
      const res = await axiosClient.post(
        "http://localhost:3000/user/historyChat",
        {
          id: id
        }
      );

      if (res.status === 200 || res.status === 201) {
        const data = res.data.getChat;
        if (data.length == 0) {
          SetMessagesChat([]);
          Navigate("/");
          return;
        }
        SetMessagesChat(res.data.getChat);
        return;
      }
    } catch (error) {
      console.error("Retrying... Error:", error);
    }
  };

  const getAllChat = async () => {
    try {
      const activeUser = JSON.parse(localStorage.getItem("active"));
      const id = activeUser.dataLogin.dataUser.id;
      if (id !== null) {
        const res = await axiosClient.post("http://localhost:3000/user/chat", {
          id: id
        });
        if (res?.status === 200 || res?.status === 201) {
          setHistoryChat(res.data.getChat);
          return;
        }
      }
    } catch (error) {
      console.error("Retrying... Error:", error);
    }
  };

  useEffect(() => {
    if (isLogin && isRole !== null) {
      const id = cuoichuoi;
      const roomLoCa = localStorage.getItem("room");

      if (cuoichuoi === roomLoCa) {
        newchat();
        localStorage.removeItem("room");
      } else {
        // console.log("🚀 ~ useEffect ~ id:", id);
        if (id) {
          getOneChat(id);
        }
        setNewChatTest([]);
      }
      getAllChat();
    }
  }, [Location.pathname]);

  // useEffect(() => {
  //   getAllChat();
  // }, []);

  const newchat = () => {
    setNewChatTest((prevHistoryChat) => [
      ...prevHistoryChat,
      { chat_id: `${cuoichuoi}`, chat_title: "New Chat" }
    ]);
  };
  // console.log("message chwat", message);

  return (
    <div className="flex-1 h-screen relative shadow-md overflow-y-auto">
      <aside className={`w-full aside ${!isLogin ? "flex" : ""}`}>
        <header className="w-full h-12 header__sidebar">
          <div className="coles" onClick={() => setIsSidebar(false)}>
            <img src="../../../../src/assets/user/close.svg" alt="Close" />
          </div>
          <div className="add__room" onClick={() => newChat()}>
            <img src="../../../../src/assets/user/add.svg" alt="Add" />
          </div>
        </header>
        <div className="h-16"></div>
        {isLogin && (
          <main className="list__chat--container">
            <ul className="list__chat your-scroll">
              {NewChatTest &&
                NewChatTest.map((item, index) => {
                  return (
                    <li key={index}>
                      <NavLink
                        to={`/c/${item.chat_id}`}
                        end
                        className={({ isActive }) =>
                          `list__chat--content  ${
                            isActive ? "active-room" : "inactive-link"
                          }`
                        }
                      >
                        {item.chat_title}
                      </NavLink>
                    </li>
                  );
                })}
              {HistoryChat.map((item, index) => {
                return (
                  <li key={index}>
                    <NavLink
                      to={`/c/${item.chat_id}`}
                      end
                      className={({ isActive }) =>
                        `list__chat--content  ${
                          isActive ? "active-room" : "inactive-link"
                        }`
                      }
                    >
                      {item.chat_title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </main>
        )}
        {!isLogin && (
          <div className="container__btn">
            <button className="login-btn" onClick={redirectToLogin}>
              Đăng Nhập
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
