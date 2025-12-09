import { ConversationEmptyState } from '@/components/ai-elements/Conversation';
import Typography from '@mui/material/Typography';
import { Trans } from '@lingui/react';

import React from 'react';
import { AuroraText } from './AuroraText';
import { mergeClassNames } from '@/utils/classNames';

const ChatEmptyState = () => {
  return (
    <div className={mergeClassNames('absolute left-1/2 top-64 -translate-x-1/2')}>
      <ConversationEmptyState>
        <Typography component="h1" variant="h2">
          <AuroraText>
            <Trans id="chat.welcome.title" message="Welcome to HelloCiti" />
          </AuroraText>
        </Typography>
        <Typography component="p" variant="body1">
          <Trans
            id="chat.welcome.subtitle"
            message="Type a question below and I'll guide you through your new city."
          />
        </Typography>
      </ConversationEmptyState>
    </div>
  );
};

export default ChatEmptyState;
