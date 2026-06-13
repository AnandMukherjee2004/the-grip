type Message = {
  avatar: string;
  avatarClass: string;
  name: string;
  time: string;
  text: string;
  delay?: string;
};

type ChatThreadProps = {
  messages: Message[];
  className?: string;
  showTyping?: boolean;
};

export function ChatThread({
  messages,
  className = "chat",
  showTyping = true,
}: ChatThreadProps) {
  return (
    <div className={className}>
      {messages.map((msg) => (
        <div
          key={`${msg.name}-${msg.time}`}
          className="msg"
          style={
            msg.delay
              ? ({ "--d": msg.delay } as React.CSSProperties)
              : undefined
          }
        >
          <span className={`avatar ${msg.avatarClass}`}>{msg.avatar}</span>
          <div>
            <div className="msg-meta">
              <span className="msg-name">{msg.name}</span>
              <span className="msg-time">{msg.time}</span>
            </div>
            <p className="msg-text">{msg.text}</p>
          </div>
        </div>
      ))}
      {showTyping && (
        <div className="typing" aria-hidden>
          <span className="td" />
          <span className="td" />
          <span className="td" />
        </div>
      )}
    </div>
  );
}
