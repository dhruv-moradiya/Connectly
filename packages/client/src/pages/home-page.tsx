import ChatItem from "@/components/chat-sidebar/chat-item";
import ChatsLoader from "@/components/chat-sidebar/chats-loader";
import { getUserChatsThunk } from "@/store/chats/user-chats-slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  const dispatch = useAppDispatch();
  const isMobileScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const { chats = [], isLoading } = useAppSelector((state) => state.userChats);
  console.log("isMobileScreen :>> ", isMobileScreen);

  useEffect(() => {
    if (isMobileScreen) {
      dispatch(getUserChatsThunk());
    }
  }, [dispatch]);

  return (
    <div>
      {isMobileScreen && (
        <div>
          {isLoading ? (
            <ChatsLoader />
          ) : (
            chats.map((chat) => <ChatItem key={chat._id} chat={chat} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
