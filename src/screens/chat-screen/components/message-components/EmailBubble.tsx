import React from 'react';
import { Animated } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

import { tailwind } from '@/theme';

import { EmailMeta } from './EmailMeta';
import { Message } from '@/types';
import { MarkdownBubble } from './MarkdownBubble';
import { MessageAttachments } from './MessageAttachments';
import { MESSAGE_TYPES } from '@/constants';
import { getRenderableEmailBody } from '@/utils/messageUtils';

type EmailBubbleProps = {
  item: Message;
  variant: string;
  orientation?: string;
};

export const EmailBubble = (props: EmailBubbleProps) => {
  const messageItem = props.item as Message;
  const { sender, contentAttributes, messageType } = messageItem;
  const emailBody = getRenderableEmailBody(messageItem);

  const isOutgoing = messageType === MESSAGE_TYPES.OUTGOING;

  const formattedEmail = emailBody.content.replace('height:100%;', '');

  const baseStyle = `
        html, body {
          margin: 0;
          padding: 0;
          overflow-wrap: anywhere;
        }
        * {
          font-family: system,-apple-system,".SFNSText-Regular","San Francisco",Roboto,"Segoe UI","Helvetica Neue","Lucida Grande",sans-serif;
          font-size: 16px;
          line-height: 1.45;
        }
        p {
          margin: 0 0 14px !important;
        }
        p:last-child {
          margin-bottom: 0 !important;
        }
        img{
          max-width: 100% !important;
        }
      `;
  const outgoingReadableStyle = `
        :root {
          color-scheme: light;
        }
        html, body {
          background: #ffffff;
          color: #111827;
        }
      `;
  const emailCustomStyle = isOutgoing ? `${outgoingReadableStyle}${baseStyle}` : baseStyle;

  return (
    <React.Fragment>
      {contentAttributes && <EmailMeta {...{ contentAttributes, sender }} />}
      <Animated.View style={[tailwind.style('flex  w-full')]}>
        <Animated.View style={tailwind.style('w-full')}>
          {emailBody.format === 'markdown' ? (
            <MarkdownBubble messageContent={emailBody.content} variant={props.variant} />
          ) : (
            <AutoHeightWebView
              style={{ width: '100%', minHeight: 1, minWidth: '100%' }}
              scrollEnabled={false}
              forceDarkOn={false}
              customStyle={emailCustomStyle}
              source={{
                html: formattedEmail,
              }}
              viewportContent={'width=device-width, user-scalable=no'}
            />
          )}
        </Animated.View>
        <MessageAttachments
          item={messageItem}
          variant={props.variant}
          orientation={props.orientation}
          mediaSize="thumbnail"
        />
      </Animated.View>
    </React.Fragment>
  );
};
