// Import all dependencies, mostly using destructuring for better view.
import {
    ClientConfig,
    MessageAPIResponseBase,
    messagingApi,
    webhook,
    HTTPFetchError,
  } from '@line/bot-sdk';
  import  { Request, Response} from 'express';
  
  const clientConfig: ClientConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  };

  const client = new messagingApi.MessagingApiClient(clientConfig);
  
  const isTextEvent = (event: any): event is webhook.MessageEvent & { message: webhook.TextMessageContent } => {
    return event.type === 'message' && event.message && event.message.type === 'text';
  };
  
  // Function handler to receive the text.
  const textEventHandler = async (event: webhook.Event): Promise<MessageAPIResponseBase | undefined> => {
    // Process all variables here.
    if (!isTextEvent(event)) {
      return;
    }
  
    // Process all message related variables here.
    // Create a new message.
    // Reply to the user.
    await client.replyMessage({
      replyToken: event.replyToken as string,
      messages: [{
        type: 'text',
        text: "こちらを開いてください\n\nhttps://liff.line.me/2004630740-GXNo7135",
      }],
    });
  };
  
  export const callback = async (req: Request, res: Response): Promise<Response> => {
      const callbackRequest: webhook.CallbackRequest = req.body;
      const events: webhook.Event[] = callbackRequest.events!;
  
      // Process all the received events asynchronously.
      const results = await Promise.all(
        events.map(async (event: webhook.Event) => {
          try {
            await textEventHandler(event);
          } catch (err: unknown) {
            if (err instanceof HTTPFetchError) {
              console.error(err.status);
              console.error(err.headers.get('x-line-request-id'));
              console.error(err.body);
            } else if (err instanceof Error) {
              console.error(err);
            }
  
            // Return an error message.
            return res.status(500).json({
              status: 'error',
            });
          }
        })
      );
  
      // Return a successful message.
      return res.status(200).json({
        status: 'success',
        results,
      });
    }
