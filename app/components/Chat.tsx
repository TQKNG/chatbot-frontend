import React from 'react'

interface ChatProps
{
  key:number;
  item:{
    role:string;
    content:string;
    img_url?:string;
  }
} 


const Chat:React.FC<ChatProps> = ({key,item}) => {
  return (
    <React.Fragment key={key}>
    <br />
    {item.role === "assistant" ? (
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Bot-chat bubble"
              src="/Logo-Virbrix.png"
            />
          </div>
        </div>
        <div className="flex flex-col bg-primary chat-bubble max-w-[400px]">
          <strong className="badge bg-secondary text-white border-none">
            {/* ChatBOK */}
            Virbrix
          </strong>
          {item.content === "" ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <div className="flex flex-col w-100 align-center justify-start">
              <div>
              {item?.content}
              </div>
              {item?.img_url && (
                <img
                  alt="Bot-chat bubble"
                  src={item.img_url}
                  className="chat-image"
                />
              )}
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
              src="/logo-user-2.png"
            />
          </div>
        </div>
        <div className="chat-bubble bg-transparent text-white max-w-[400px]">
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