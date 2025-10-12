'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Trans } from '@lingui/react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import type { ChecklistItem } from '@/types/checklist.types';
import type { CreateItemRequest } from '@/api/checklistItemApi';

interface ChecklistItemModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  item?: ChecklistItem | null;
  onClose: () => void;
  onSubmit: (data: CreateItemRequest) => Promise<void>;
}

const ChecklistItemModal: React.FC<ChecklistItemModalProps> = ({
  open,
  mode,
  item,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && item) {
      setTitle(item.title);
      setDescription(item.description);
      setImportance(item.importance);
      setDueDate(item.dueDate ? dayjs(item.dueDate) : dayjs());
      setCategory(item.category || '');
    } else {
      // Reset form for add mode
      setTitle('');
      setDescription('');
      setImportance('medium');
      setDueDate(dayjs());
      setCategory('');
    }
  }, [mode, item, open]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        importance,
        dueDate: dueDate?.format('YYYY-MM-DD'),
        category: category.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit checklist item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? (
          <Trans id="checklist-item-modal.add-title" message="Add Checklist Item" />
        ) : (
          <Trans id="checklist-item-modal.edit-title" message="Edit Checklist Item" />
        )}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={<Trans id="checklist-item-modal.title" message="Title" />}
          type="text"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label={<Trans id="checklist-item-modal.description" message="Description" />}
          type="text"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>
            <Trans id="checklist-item-modal.importance" message="Importance" />
          </InputLabel>
          <Select
            value={importance}
            label={<Trans id="checklist-item-modal.importance" message="Importance" />}
            onChange={(e) => setImportance(e.target.value as 'high' | 'medium' | 'low')}
          >
            <MenuItem value="high">
              <Trans id="checklist.importance.high" message="HIGH" />
            </MenuItem>
            <MenuItem value="medium">
              <Trans id="checklist.importance.medium" message="MEDIUM" />
            </MenuItem>
            <MenuItem value="low">
              <Trans id="checklist.importance.low" message="LOW" />
            </MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={<Trans id="checklist-item-modal.due-date" message="Due Date" />}
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'dense',
              },
            }}
          />
        </LocalizationProvider>
        <TextField
          margin="dense"
          label={<Trans id="checklist-item-modal.category" message="Category" />}
          type="text"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          <Trans id="checklist-item-modal.cancel" message="Cancel" />
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || !title.trim()}>
          {mode === 'add' ? (
            <Trans id="checklist-item-modal.add-button" message="Add" />
          ) : (
            <Trans id="checklist-item-modal.save-button" message="Save" />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChecklistItemModal;
