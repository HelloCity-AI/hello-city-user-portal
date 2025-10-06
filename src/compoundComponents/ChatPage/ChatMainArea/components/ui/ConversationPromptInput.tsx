import type { FormEvent } from 'react';
import type { PromptInputMessage } from '@/components/ai-elements/PromptInput';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/PromptInput';
import { Typography } from '@mui/material';
import { Trans } from '@lingui/react';
import { mergeClassNames } from '@/utils/classNames';

export interface ConversationPromptInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage, event: FormEvent) => void;
  isAIReplying: boolean;
  isCreating?: boolean;
}

export function ConversationPromptInput({
  value,
  onValueChange,
  onSubmit,
  isAIReplying,
  isCreating = false,
}: ConversationPromptInputProps) {
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-4xl">
        <PromptInput
          onSubmit={onSubmit}
          className={mergeClassNames(
            'group relative flex items-end gap-4 p-4',
            'rounded-2xl',
            'transition-all duration-200',
            'glassmorphism glassmorphism-hover',
          )}
        >
          <div className="flex-1">
            <PromptInputTextarea
              value={value}
              placeholder="Are you ready to make new adventure?"
              onChange={(event) => onValueChange(event.currentTarget.value)}
              className={mergeClassNames(
                'field-sizing-content max-h-[7lh] w-full',
                'resize-none rounded-none border-none shadow-none',
                'bg-transparent p-3',
                'outline-none ring-0 focus-visible:ring-0',
              )}
            />
          </div>

          {!value.trim() && (
            <div className="hidden items-center gap-1 border-none px-2 md:flex">
              <Typography variant="caption" component="span" className="text-gray-500">
                <Trans id="chat.input.hint.press" message="Press" />
              </Typography>
              <Typography variant="caption" component="kbd" className="font-mono text-gray-600">
                ↵
              </Typography>
              <Typography variant="caption" component="span" className="text-gray-500">
                <Trans id="chat.input.hint.send" message="to send" />
              </Typography>
            </div>
          )}

          <PromptInputSubmit
            status={'ready'}
            disabled={!value.trim() || isAIReplying || isCreating}
          />
        </PromptInput>

        {/* AI Disclaimer */}
        <div className="mt-2 text-center">
          <Typography variant="caption" className="text-xs text-gray-400">
            <Trans
              id="chat.disclaimer"
              message="AI may make mistakes. Please verify important information."
            />
          </Typography>
        </div>
      </div>
    </div>
  );
}
