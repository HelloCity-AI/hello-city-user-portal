'use client';

import React, { useState } from 'react';
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
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { Trans, useLingui } from '@lingui/react';
import type { CreateChecklistItemRequest } from '../../types/checkList.types';
import DatePicker from '@/components/DatePicker';
import dayjs from 'dayjs';
interface CreateChecklistItemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChecklistItemRequest) => Promise<void>;
  userId: string;
}

export const CreateChecklistItemModal: React.FC<CreateChecklistItemModalProps> = ({
  open,
  onClose,
  onSubmit,
  userId,
}) => {
  const { i18n } = useLingui();

  const [formData, setFormData] = useState<CreateChecklistItemRequest>({
    ownerId: userId,
    title: '',
    description: '',
    isComplete: false,
    importance: 'Low',
    dueDate: dayjs().add(7, 'day'),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const [touched, setTouched] = useState<Record<string, boolean>>({
    title: false,
    description: false,
  });

  const handleInputChange = (field: keyof CreateChecklistItemRequest, value: unknown) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      if (field === 'title' || field === 'description') {
        if (typeof value === 'string' && value === '') {
          setTimeout(() => {
            const element = document.getElementById(field as string);
            if (element) {
              element.setAttribute('aria-invalid', 'true');
            }
          }, 0);
        }
      }

      return newData;
    });
  };
  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: newDate,
    }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async () => {
    setTouched({
      title: true,
      description: true,
    });

    if (!isFormValid()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit(formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create checklist item:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : i18n._('create-checklist.error.create', { default: 'Failed to create item' }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ownerId: userId,
      title: '',
      description: '',
      isComplete: false,
      importance: 'Low',
      dueDate: dayjs(null),
    });
    setTouched({
      title: false,
      description: false,
    });
    setSubmitError('');
  };

  const isFormValid = () => {
    return formData.title.trim() !== '' && formData.description.trim() !== '';
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Trans id="create-checklist.title" message="Create New Checklist Item" />
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          <TextField
            label={<Trans id="create-checklist.title-field" message="Title" />}
            placeholder={i18n._('create-checklist.title-placeholder', {
              default: 'Enter a clear, descriptive title for your task',
            })}
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            fullWidth
            required
            error={touched.title && (formData.title === '' || !formData.title.trim())}
            helperText={
              touched.title && (!formData.title.trim() || formData.title === '')
                ? i18n._('create-checklist.title-required', { default: 'Title is required' })
                : i18n._('create-checklist.title-helper', {
                    default: 'Give your checklist item a clear, concise name',
                  })
            }
            disabled={isSubmitting}
          />

          <TextField
            label={<Trans id="create-checklist.description-field" message="Description" />}
            placeholder={i18n._('create-checklist.description-placeholder', {
              default: 'Describe what needs to be done, any important details, or steps involved',
            })}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            onBlur={() => handleBlur('description')} // 添加这一行
            fullWidth
            multiline
            rows={3}
            required
            error={
              touched.description && (formData.description === '' || !formData.description.trim())
            }
            helperText={
              touched.description && (!formData.description.trim() || formData.description === '')
                ? i18n._('create-checklist.description-required', {
                    default: 'Description is required',
                  })
                : i18n._('create-checklist.description-helper', {
                    default: 'Provide details about this task - what needs to be accomplished?',
                  })
            }
            disabled={isSubmitting}
          />
          <DatePicker
            label={<Trans id="create-checklist.due-date" message="Due Date" />}
            value={formData.dueDate}
            onChange={handleDateChange}
            disabled={isSubmitting}
          />
          <FormControl fullWidth disabled={isSubmitting}>
            <InputLabel>
              <Trans id="create-checklist.importance-field" message="Importance" />
            </InputLabel>
            <Select
              value={formData.importance}
              label={i18n._('create-checklist.importance-field', { default: 'Importance' })}
              onChange={(e) => handleInputChange('importance', e.target.value)}
            >
              <MenuItem value="Low">
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography>
                    <Trans id="importance.low" message="Low" />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <Trans id="create-checklist.importance-low-desc" message="Can wait" />
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="Medium">
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography>
                    <Trans id="importance.medium" message="Medium" />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <Trans id="create-checklist.importance-medium-desc" message="Should do soon" />
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="High">
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography>
                    <Trans id="importance.high" message="High" />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <Trans id="create-checklist.importance-high-desc" message="Urgent" />
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1 }}>
              <Trans
                id="create-checklist.importance-helper"
                message="How important is this task?"
              />
            </Typography>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isComplete}
                onChange={(e) => handleInputChange('isComplete', e.target.checked)}
                disabled={isSubmitting}
              />
            }
            label={
              <Box>
                <Typography>
                  <Trans id="create-checklist.mark-completed" message="Mark as completed" />
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <Trans
                    id="create-checklist.mark-completed-helper"
                    message="Check this if the task is already finished"
                  />
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting} variant="outlined">
          <Trans id="create-checklist.cancel" message="Cancel" />
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
        >
          {isSubmitting ? (
            <Trans id="create-checklist.creating" message="Creating..." />
          ) : (
            <Trans id="create-checklist.create" message="Create Item" />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
