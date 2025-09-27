'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/material';
import { Trans } from '@lingui/react';

// TODO: Temporary setting - change back to false later
const ALWAYS_SHOW_THINKING = true;

const breathingDot = keyframes`
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -300% 0;
  }
  100% {
    background-position: 0% 0;
  }
`;

interface AiThinkingIndicatorProps {
  variant?: 'full' | 'compact';
  size?: 'small' | 'medium' | 'large';
  isThinking?: boolean; // Controls whether to show thinking state
}

export default function AiThinkingIndicator({
  variant = 'full',
  size = 'medium',
  isThinking = false,
}: AiThinkingIndicatorProps) {
  const dotSize = {
    small: 10,
    medium: 12,
    large: 14,
  }[size];

  // Temporarily force showing thinking state
  const shouldShowThinking = ALWAYS_SHOW_THINKING || isThinking;

  // Return null if thinking state should not be displayed
  if (!shouldShowThinking) {
    return null;
  }

  // Compact variant - just breathing dot
  if (variant === 'compact') {
    return (
      <Box className="flex items-center justify-center p-2">
        <Box
          className="rounded-full bg-primary-color"
          sx={{
            width: dotSize,
            height: dotSize,
            animation: `${breathingDot} 1.5s infinite ease-in-out`,
          }}
        />
      </Box>
    );
  }

  // Full variant - complete message bubble with enhanced animation
  return (
    <div className="mb-4 flex items-center gap-3">
      <Box
        className="relative flex min-h-12 items-center gap-2 border-0 bg-transparent px-4 py-3 text-base leading-relaxed shadow-none"
        sx={{
          borderRadius: '20px 20px 20px 4px',
        }}
      >
        {/* Breathing dot animation */}
        <Box
          className="rounded-full bg-primary-color"
          sx={{
            width: dotSize,
            height: dotSize,
            animation: `${breathingDot} 1.5s infinite ease-in-out`,
          }}
        />

        {/* Thinking text with shimmer effect */}
        <Typography
          variant="caption"
          className="ml-1 italic"
          sx={{
            fontSize: '12px',
            background: `linear-gradient(
              90deg,
              rgba(107, 114, 128, 1) 0%,
              rgba(107, 114, 128, 1) 40%,
              rgba(220, 220, 220, 1) 50%,
              rgba(107, 114, 128, 1) 60%,
              rgba(107, 114, 128, 1) 100%
            )`,
            backgroundSize: '300% 100%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            animation: `${shimmer} 6s infinite linear`,
            textShadow: '0 0 8px rgba(92, 109, 247, 0.3)',
          }}
        >
          <Trans id="ai.thinking" message="AI正在思考..." />
        </Typography>
      </Box>
    </div>
  );
}
