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
    <div className="flex justify-center px-2 md:px-4">
      <div className="w-full max-w-4xl">
        <div className="relative">
          <PromptInput
            onSubmit={onSubmit}
            className={mergeClassNames(
              'group relative flex items-end',
              // Responsive gap and padding
              'gap-2 md:gap-4',
              'p-3 md:p-4',
              // Ensure minimum height for touch targets on mobile
              'min-h-[56px]',
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
                  'bg-transparent',
                  // Responsive padding and font size
                  'p-2 md:p-3',
                  'text-base md:text-sm',
                  // Smaller placeholder on mobile
                  'placeholder:text-sm md:placeholder:text-sm',
                  // Ensure minimum height for mobile touch
                  'min-h-[40px]',
                  'outline-none ring-0 focus-visible:ring-0',
                )}
              />
            </div>

            <PromptInputSubmit
              status={'ready'}
              disabled={!value.trim() || isAIReplying || isCreating}
            />
          </PromptInput>

          {/* Hint text with absolute positioning */}
          {!value.trim() && (
            <div className="absolute bottom-4 right-20 hidden items-center gap-1 md:flex">
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
        </div>

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
