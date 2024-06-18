import React from 'react'

const Chat = ({key,item}) => {
  return (
    <React.Fragment key={key}>
    <br />
    {item.role === "assistant" ? (
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Bot-chat bubble"
              src="/logo-v3.png"
            />
          </div>
        </div>
        <div className="flex flex-col chat-bubble max-w-[400px]">
          <strong className="badge bg-aquaTurquoise text-black">
            ChatBOK
          </strong>
          {item.content === "" ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <div className="flex w-100 align-center justify-start">
              {item?.content}
            </div>
          )}
        </div>
        <br />
      </div>
    ) : (
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="user-chat bubble"
              src="/logo-user.png"
            />
          </div>
        </div>
        <div className="chat-bubble bg-aquaTurquoise text-black max-w-[400px]">
          <strong className="badge ">User</strong>
          <br />

          <div>{item?.content}</div>
        </div>
      </div>
    )}
  </React.Fragment>
  )
}

export default Chat