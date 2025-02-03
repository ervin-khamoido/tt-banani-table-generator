import { FunctionComponent } from "react";
import { ClientMessage } from "@/app/actions";

interface Props {
  conversation: ClientMessage[];
}

const MessageBubbleList: FunctionComponent<Props> = ({ conversation }) => {
  return (
    <div className="space-y-4 mb-4">
      {conversation.map((message: ClientMessage) => {
        const classNameToRender = `p-4 rounded-lg ${
          message.role === "user"
            ? "bg-blue-50 text-blue-500"
            : "bg-gray-50 text-gray-500"
        }`;

        return (
          <div key={message.id} className={classNameToRender}>
            {message.display}
          </div>
        );
      })}
    </div>
  );
};

export default MessageBubbleList;
