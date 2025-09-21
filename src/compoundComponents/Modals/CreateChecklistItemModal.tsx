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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (field: keyof CreateChecklistItemRequest, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit(formData);
      resetForm();
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
            label={<Trans id="create-checklist.title-field" message="Title *" />}
            placeholder={i18n._('create-checklist.title-placeholder', {
              default: 'Enter a clear, descriptive title for your task',
            })}
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            fullWidth
            required
            error={!formData.title.trim() && formData.title !== ''}
            helperText={
              !formData.title.trim() && formData.title !== ''
                ? i18n._('create-checklist.title-required', { default: 'Title is required' })
                : i18n._('create-checklist.title-helper', {
                    default: 'Give your checklist item a clear, concise name',
                  })
            }
            disabled={isSubmitting}
          />

          <TextField
            label={<Trans id="create-checklist.description-field" message="Description *" />}
            placeholder={i18n._('create-checklist.description-placeholder', {
              default: 'Describe what needs to be done, any important details, or steps involved',
            })}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
            error={!formData.description.trim() && formData.description !== ''}
            helperText={
              !formData.description.trim() && formData.description !== ''
                ? i18n._('create-checklist.description-required', {
                    default: 'Description is required',
                  })
                : i18n._('create-checklist.description-helper', {
                    default: 'Provide details about this task - what needs to be accomplished?',
                  })
            }
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
