'use client';

import { Button, CircularProgress, IconButton } from '@mui/material';
import Image from 'next/image';
import { AttachFile, Close, Send, Stop } from '@mui/icons-material';
import { Textarea } from './Textarea';
import { mergeClassNames } from '@/utils/classNames';
import type { ChatStatus, FileUIPart } from 'ai';
import { nanoid } from 'nanoid';
import {
  type ChangeEventHandler,
  Children,
  type ComponentProps,
  createContext,
  type FormEvent,
  type FormEventHandler,
  Fragment,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type AttachmentsContext = {
  files: (FileUIPart & { id: string })[];
  add: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
};

const AttachmentsContext = createContext<AttachmentsContext | null>(null);

export const usePromptInputAttachments = () => {
  const context = useContext(AttachmentsContext);

  if (!context) {
    throw new Error('usePromptInputAttachments must be used within a PromptInput');
  }

  return context;
};

export type PromptInputAttachmentProps = HTMLAttributes<HTMLDivElement> & {
  data: FileUIPart & { id: string };
  className?: string;
};

export function PromptInputAttachment({ data, className, ...props }: PromptInputAttachmentProps) {
  const attachments = usePromptInputAttachments();

  return (
    <div
      className={mergeClassNames('group relative h-14 w-14 rounded-md border', className)}
      key={data.id}
      {...props}
    >
      {data.mediaType?.startsWith('image/') && data.url ? (
        <Image
          alt={data.filename || 'attachment'}
          className="size-full rounded-md object-cover"
          height={56}
          src={data.url}
          width={56}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <AttachFile className="size-4" />
        </div>
      )}
      <IconButton
        aria-label="Remove attachment"
        className="absolute -right-1.5 -top-1.5 h-6 w-6 rounded-full border border-border bg-background opacity-0 group-hover:opacity-100"
        onClick={() => attachments.remove(data.id)}
        type="button"
        size="small"
      >
        <Close className="h-3 w-3" />
      </IconButton>
    </div>
  );
}

export type PromptInputAttachmentsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: (attachment: FileUIPart & { id: string }) => React.ReactNode;
};

export function PromptInputAttachments({
  className,
  children,
  ...props
}: PromptInputAttachmentsProps) {
  const attachments = usePromptInputAttachments();
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => {
      setHeight(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    setHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      aria-live="polite"
      className={mergeClassNames(
        'overflow-hidden transition-[height] duration-200 ease-out',
        className,
      )}
      style={{ height: attachments.files.length ? height : 0 }}
      {...props}
    >
      <div className="flex flex-wrap gap-2 p-3 pt-3" ref={contentRef}>
        {attachments.files.map((file) => (
          <Fragment key={file.id}>{children(file)}</Fragment>
        ))}
      </div>
    </div>
  );
}

export type PromptInputMessage = {
  text?: string;
  files?: FileUIPart[];
};

export type PromptInputProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  accept?: string; // e.g., "image/*" or leave undefined for any
  multiple?: boolean;
  // When true, accepts drops anywhere on document. Default false (opt-in).
  globalDrop?: boolean;
  // Render a hidden input with given name and keep it in sync for native form posts. Default false.
  syncHiddenInput?: boolean;
  // Minimal constraints
  maxFiles?: number;
  maxFileSize?: number; // bytes
  onError?: (err: { code: 'max_files' | 'max_file_size' | 'accept'; message: string }) => void;
  onSubmit: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void;
};

export const PromptInput = ({
  className,
  accept,
  multiple,
  globalDrop,
  syncHiddenInput,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  ...props
}: PromptInputProps) => {
  const [items, setItems] = useState<(FileUIPart & { id: string })[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Find nearest form to scope drag & drop
  useEffect(() => {
    const root = anchorRef.current?.closest('form');
    if (root instanceof HTMLFormElement) {
      formRef.current = root;
    }
  }, []);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const matchesAccept = useCallback(
    (f: File) => {
      if (!accept || accept.trim() === '') {
        return true;
      }
      // Simple check: if accept includes "image/*", filter to images; otherwise allow.
      if (accept.includes('image/*')) {
        return f.type.startsWith('image/');
      }
      return true;
    },
    [accept],
  );

  const add = useCallback(
    (files: File[] | FileList) => {
      const incoming = Array.from(files);
      const accepted = incoming.filter((f) => matchesAccept(f));
      if (accepted.length === 0) {
        onError?.({
          code: 'accept',
          message: 'No files match the accepted types.',
        });
        return;
      }
      const withinSize = (f: File) => (maxFileSize ? f.size <= maxFileSize : true);
      const sized = accepted.filter(withinSize);
      if (sized.length === 0 && accepted.length > 0) {
        onError?.({
          code: 'max_file_size',
          message: 'All files exceed the maximum size.',
        });
        return;
      }
      setItems((prev) => {
        const capacity =
          typeof maxFiles === 'number' ? Math.max(0, maxFiles - prev.length) : undefined;
        const capped = typeof capacity === 'number' ? sized.slice(0, capacity) : sized;
        if (typeof capacity === 'number' && sized.length > capacity) {
          onError?.({
            code: 'max_files',
            message: 'Too many files. Some were not added.',
          });
        }
        const next: (FileUIPart & { id: string })[] = [];
        for (const file of capped) {
          next.push({
            id: nanoid(),
            type: 'file',
            url: URL.createObjectURL(file),
            mediaType: file.type,
            filename: file.name,
          });
        }
        return prev.concat(next);
      });
    },
    [matchesAccept, maxFiles, maxFileSize, onError],
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const found = prev.find((file) => file.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((file) => file.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setItems((prev) => {
      for (const file of prev) {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      }
      return [];
    });
  }, []);

  // Note: File input cannot be programmatically set for security reasons
  // The syncHiddenInput prop is no longer functional
  useEffect(() => {
    if (syncHiddenInput && inputRef.current) {
      // Clear the input when items are cleared
      if (items.length === 0) {
        inputRef.current.value = '';
      }
    }
  }, [items, syncHiddenInput]);

  // Attach drop handlers on nearest form and document (opt-in)
  useEffect(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    form.addEventListener('dragover', onDragOver);
    form.addEventListener('drop', onDrop);
    return () => {
      form.removeEventListener('dragover', onDragOver);
      form.removeEventListener('drop', onDrop);
    };
  }, [add]);

  useEffect(() => {
    if (!globalDrop) {
      return;
    }
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    return () => {
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
    };
  }, [add, globalDrop]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.currentTarget.files) {
      add(event.currentTarget.files);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const files: FileUIPart[] = items.map(({ ...item }) => ({
      ...item,
    }));

    onSubmit({ text: event.currentTarget.message.value, files }, event);
  };

  const ctx = useMemo<AttachmentsContext>(
    () => ({
      files: items.map((item) => ({ ...item, id: item.id })),
      add,
      remove,
      clear,
      openFileDialog,
      fileInputRef: inputRef,
    }),
    [items, add, remove, clear, openFileDialog],
  );

  return (
    <AttachmentsContext.Provider value={ctx}>
      <span aria-hidden="true" className="hidden" ref={anchorRef} />
      <input
        accept={accept}
        className="hidden"
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
      <form
        className={mergeClassNames(
          'w-full divide-y overflow-hidden rounded-xl border bg-background shadow-sm',
          className,
        )}
        onSubmit={handleSubmit}
        {...props}
      />
    </AttachmentsContext.Provider>
  );
};

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputBody = ({ className, ...props }: PromptInputBodyProps) => (
  <div className={mergeClassNames(className, 'flex flex-col')} {...props} />
);

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>;

export const PromptInputTextarea = ({
  onChange,
  className,
  placeholder = 'What would you like to know?',
  ...props
}: PromptInputTextareaProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      // Don't submit if IME composition is in progress
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (e.shiftKey) {
        // Allow newline
        return;
      }

      // Submit on Enter (without Shift)
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <Textarea
      className={mergeClassNames(
        'w-full resize-none rounded-none border-none p-3 shadow-none outline-none ring-0',
        'field-sizing-content bg-transparent dark:bg-transparent',
        'max-h-48 min-h-16',
        'focus-visible:ring-0',
        className,
      )}
      name="message"
      onChange={(e) => {
        onChange?.(e);
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  );
};

export type PromptInputToolbarProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputToolbar = ({ className, ...props }: PromptInputToolbarProps) => (
  <div className={mergeClassNames('flex items-center justify-between p-1', className)} {...props} />
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTools = ({ className, ...props }: PromptInputToolsProps) => (
  <div
    className={mergeClassNames(
      'flex items-center gap-1',
      '[&_button:first-child]:rounded-bl-xl',
      className,
    )}
    {...props}
  />
);

export type PromptInputButtonProps = ComponentProps<typeof Button>;

export const PromptInputButton = ({
  variant = 'outlined',
  className,
  size = 'small',
  ...props
}: PromptInputButtonProps) => {
  return (
    <Button
      className={mergeClassNames('min-w-0 shrink-0 gap-1.5 rounded-lg', className)}
      size={size}
      type="button"
      variant={variant}
      {...props}
    />
  );
};

// Note: Actions that perform side-effects (like opening a file dialog)
// are provided in opt-in modules (e.g., prompt-input-attachments).

export type PromptInputSubmitProps = {
  status?: ChatStatus;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: 'button' | 'submit';
  className?: string;
};

export const PromptInputSubmit = ({
  status,
  children,
  className,
  ...props
}: PromptInputSubmitProps) => {
  let Icon = <Send className="size-4" />;

  if (status === 'submitted') {
    Icon = <CircularProgress size={16} />;
  } else if (status === 'streaming') {
    Icon = <Stop className="size-4 text-white" />;
  } else if (status === 'error') {
    Icon = <Close className="size-4" />;
  }

  return (
    <IconButton
      type="submit"
      disabled={props.disabled}
      className={mergeClassNames(
        'flex h-10 w-10 items-center justify-center rounded-full bg-chat-send text-white transition-all duration-200 hover:-translate-y-px hover:bg-chat-send-hover disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
        className,
      )}
    >
      {children ?? Icon}
    </IconButton>
  );
};
