import { apiClient }
  from "@/services/api/client";

import {
  Conversation,
} from "../types/conversation.types";

export async function createConversation(
  assistantId: number | null,
  title: string = "New Chat"
) {
  const response = await apiClient.post(
    "/conversations",
    {
      title,
      assistant_id: assistantId,
    }
  );

  return (
    response.data.data ||
    response.data
  );
}

export async function
getConversations(
  assistantId:
    number | null
): Promise<Conversation[]> {

  const response =
    await apiClient.get(

      "/conversations",

      {

        params: {

          assistant_id:
            assistantId,

        },

      }

    );

  return response.data;
}

export async function
getConversationMessages(
  conversationId: number
) {

  const response =
    await apiClient.get(

      `/conversations/${conversationId}/messages`
    );

  return response.data;
}

export async function
deleteConversation(
  conversationId: number
) {

  const response =
    await apiClient.delete(

      `/conversations/${conversationId}`
    );

  return response.data;
}

export async function
updateConversationTitle(
  conversationId: number,
  title: string
) {

  const response =
    await apiClient.patch(

      `/conversations/${conversationId}/title`,

      {
        title,
      }
    );

  return response.data;
}