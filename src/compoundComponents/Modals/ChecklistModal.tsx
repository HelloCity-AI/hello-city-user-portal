'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Modal,
    Drawer,
    IconButton,
    Checkbox,
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckBox as CheckBoxIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useUser } from '@auth0/nextjs-auth0';
import { Trans, useLingui } from '@lingui/react';
import { CreateChecklistItemButton } from '../../components/CreateChecklistItemButton';
import { checklistApi } from '../../api/checklistApi';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import type { ChecklistItem } from '../../types/checkList.types';
import type { RootState } from '../../store';

interface ChecklistModalProps {
    open: boolean;
    onClose: () => void;
    variant?: 'modal' | 'drawer';
}

const MODAL_WIDTH = 400;
const DRAWER_WIDTH = 400;

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
    open,
    onClose,
    variant = 'drawer'
}) => {
    const { user, isLoading } = useUser();
    const { i18n } = useLingui();

    // 从Redux store获取用户信息
    const userState = useSelector((state: RootState) => state.user);
    const currentUser = userState?.data || userState?.currentUser || userState?.user;
    const userLoading = userState?.isLoading || false;

    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string>('');

    // 获取checklist items
    const fetchChecklistItems = useCallback(async () => {
        if (!currentUser?.userId) return;

        setLoading(true);
        setFetchError('');
        try {
            const items = await checklistApi.getChecklistItems(currentUser.userId);
            setChecklistItems(items);
        } catch (error) {
            console.error('Failed to fetch checklist items:', error);
            setFetchError(i18n._('checklist.error.fetch', { default: 'Failed to load checklist items' }));
        } finally {
            setLoading(false);
        }
    }, [currentUser?.userId, i18n]);

    // get checklist items when modal opens and user ID is available
    useEffect(() => {
        if (open && currentUser?.userId) {
            fetchChecklistItems();
        }
    }, [open, currentUser?.userId, fetchChecklistItems]);

    const handleItemCreated = useCallback(() => {
        fetchChecklistItems();
    }, [fetchChecklistItems]);

    const handleRetry = useCallback(() => {
        fetchChecklistItems();
    }, [fetchChecklistItems]);

    const handleToggleComplete = useCallback(async (itemId: string, isComplete: boolean) => {
        if (!currentUser?.userId) {
            console.log('No user ID available');
            return;
        }

        // get the current item to access its other fields
        const currentItem = checklistItems.find(item => item.checklistItemId === itemId);
        if (!currentItem) {
            console.error('Item not found in current state');
            return;
        }

        // clear any previous error
        setFetchError('');

        // first optimistically update the UI
        setChecklistItems(prevItems =>
            prevItems.map(item =>
                item.checklistItemId === itemId
                    ? { ...item, isComplete: !isComplete }
                    : item
            )
        );

        try {
            // create the full DTO with existing values for unchanged fields
            const editChecklistItemDto = {
                title: currentItem.title,
                description: currentItem.description,
                importance: currentItem.importance,
                isComplete: !isComplete,
            };

            const response = await fetchWithAuth(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${currentUser.userId}/checklist-item?itemId=${itemId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editChecklistItemDto),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to update checklist item: ${response.status}`);
            }

            const updatedItem = await response.json();

            // update state with response from server to ensure consistency
            setChecklistItems(prevItems =>
                prevItems.map(item =>
                    item.checklistItemId === itemId ? updatedItem : item
                )
            );
        } catch (error) {
            console.error('Failed to update checklist item:', error);

            // revert the optimistic update
            setChecklistItems(prevItems =>
                prevItems.map(item =>
                    item.checklistItemId === itemId
                        ? { ...item, isComplete: isComplete } // revert to original state
                        : item
                )
            );

            setFetchError(i18n._('checklist.error.update', { default: 'Failed to update item. Please try again.' }));
        }
    }, [currentUser?.userId, checklistItems, i18n]);

    const handleDeleteItem = useCallback(async (itemId: string) => {
        if (!currentUser?.userId) return;

        try {
            await checklistApi.deleteChecklistItem(currentUser.userId, itemId);
            fetchChecklistItems();
        } catch (error) {
            console.error('Failed to delete checklist item:', error);
            setFetchError(i18n._('checklist.error.delete', { default: 'Failed to delete checklist item' }));
        }
    }, [currentUser?.userId, fetchChecklistItems, i18n]);

    // calculate completed items
    const totalItems = checklistItems.length;
    const completedItems = checklistItems.filter(item => item.isComplete).length;

    // public checklist content component
    const ChecklistContent = () => (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: variant === 'drawer' ? '100%' : 'auto',
            width: variant === 'drawer' ? DRAWER_WIDTH : MODAL_WIDTH,
            bgcolor: '#f8fafc'
        }}>
            {/* topic */}
            <Box sx={{
                p: 3,
                bgcolor: 'white',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        <Trans id="checklist.title" message="Landing Plan" />
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: '#64748b' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Task Checklist title and stats */}
            <Box sx={{ p: 3, pb: 2, bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckBoxIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        <Trans id="checklist.task-checklist" message="Task Checklist" />
                    </Typography>
                </Box>
                {totalItems > 0 && (
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        <Trans
                            id="checklist.progress"
                            message="{completed} of {total} completed"
                            values={{ completed: completedItems, total: totalItems }}
                        />
                    </Typography>
                )}
            </Box>

            {/* show user loading state */}
            {(isLoading || userLoading) ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    p: 3,
                    minHeight: 200,
                    bgcolor: 'white'
                }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2, color: '#64748b' }}>
                        <Trans id="checklist.loading-user" message="Loading user information..." />
                    </Typography>
                </Box>
            ) : !currentUser?.userId ? (
                <Box sx={{ p: 3, bgcolor: 'white' }}>
                    <Alert severity="warning">
                        <Trans
                            id="checklist.profile-setup-required"
                            message="Please complete your profile setup to use the checklist feature."
                        />
                    </Alert>
                </Box>
            ) : (
                <>
                    {/* content area */}
                    <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        p: 3,
                        pt: 0,
                        maxHeight: variant === 'modal' ? '60vh' : 'none',
                        bgcolor: 'white'
                    }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                                <CircularProgress size={24} />
                                <Typography variant="body2" sx={{ ml: 2, color: '#64748b' }}>
                                    <Trans id="checklist.loading-items" message="Loading checklist items..." />
                                </Typography>
                            </Box>
                        ) : fetchError ? (
                            <Alert
                                severity="error"
                                action={
                                    <Button color="inherit" size="small" onClick={handleRetry}>
                                        <Trans id="checklist.retry" message="Retry" />
                                    </Button>
                                }
                            >
                                {fetchError}
                            </Alert>
                        ) : checklistItems.length === 0 ? (
                            <Box sx={{
                                textAlign: 'center',
                                py: 4,
                                backgroundColor: 'grey.50',
                                borderRadius: 2,
                                border: '2px dashed',
                                borderColor: 'grey.300'
                            }}>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    <Trans id="checklist.no-items" message="No checklist items yet" />
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Trans
                                        id="checklist.no-items-description"
                                        message='Click the "Add Checklist Item" button above to create your first item'
                                    />
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {checklistItems.map((item, index) => (
                                    <ChecklistItemCard
                                        key={item.checklistItemId}
                                        item={item}
                                        index={index}
                                        onToggleComplete={handleToggleComplete}
                                        onDelete={handleDeleteItem}
                                    />
                                ))}

                                {/* Add new item button */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        borderColor: '#3b82f6',
                                        bgcolor: '#f8fafc'
                                    },
                                    mt: 1
                                }}>
                                    <CreateChecklistItemButton
                                        userId={currentUser.userId}
                                        onItemCreated={handleItemCreated}
                                        size="small"
                                        variant="button"
                                        fullWidth={false}
                                        sx={{
                                            border: 'none',
                                            bgcolor: 'transparent',
                                            color: '#64748b',
                                            '&:hover': {
                                                bgcolor: 'transparent',
                                                color: '#3b82f6'
                                            },
                                            textTransform: 'none',
                                            fontWeight: 400
                                        }}
                                    >
                                        <Trans id="checklist.add-new-task" message="Add new task" />
                                    </CreateChecklistItemButton>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );

    // Drawer variant
    if (variant === 'drawer') {
        return (
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: DRAWER_WIDTH,
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <ChecklistContent />
            </Drawer>
        );
    }

    // Modal variant
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="checklist-modal-title"
            aria-describedby="checklist-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxHeight: '80vh',
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
            }}>
                <ChecklistContent />
            </Box>
        </Modal>
    );
};

// updated checklist item card component
interface ChecklistItemCardProps {
    item: ChecklistItem;
    index: number;
    onToggleComplete: (itemId: string, isComplete: boolean) => void;
    onDelete: (itemId: string) => void;
}

const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
    item,
    index,
    onToggleComplete,
    onDelete
}) => {
    const { i18n } = useLingui();

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'High': return '#ef4444';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#06b6d4';
            default: return '#06b6d4';
        }
    };

    const getImportanceText = (importance: string) => {
        switch (importance) {
            case 'High':
                return i18n._('importance.high', { default: 'High' });
            case 'Medium':
                return i18n._('importance.medium', { default: 'Medium' });
            case 'Low':
                return i18n._('importance.low', { default: 'Low' });
            default:
                return i18n._('importance.low', { default: 'Low' });
        }
    };

    // handle checkbox change
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        onToggleComplete(item.checklistItemId, item.isComplete);
    };

    // handle title click to toggle complete
    const handleTitleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onToggleComplete(item.checklistItemId, item.isComplete);
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            p: 2,
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            bgcolor: item.isComplete ? '#f0f9ff' : 'white',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                borderColor: '#3b82f6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }
        }}>
            {/* Checkbox */}
            <Checkbox
                checked={item.isComplete}
                onChange={handleCheckboxChange}
                sx={{
                    p: 0,
                    mr: 2,
                    mt: 0.5,
                    '& .MuiSvgIcon-root': {
                        fontSize: 20,
                        color: item.isComplete ? '#10b981' : '#cbd5e1'
                    }
                }}
            />

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 500,
                            color: item.isComplete ? '#64748b' : '#1e293b',
                            textDecoration: item.isComplete ? 'line-through' : 'none',
                            flex: 1,
                            mr: 1,
                            cursor: 'pointer'
                        }}
                        onClick={handleTitleClick}
                    >
                        {item.title}
                    </Typography>

                    <Chip
                        label={getImportanceText(item.importance)}
                        size="small"
                        sx={{
                            bgcolor: getImportanceColor(item.importance),
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 20,
                            minWidth: 60
                        }}
                    />
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: '#64748b',
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                        mb: 1,
                        textDecoration: item.isComplete ? 'line-through' : 'none'
                    }}
                >
                    {item.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                        {item.isComplete ? (
                            <Trans id="checklist.status.completed" message="Completed" />
                        ) : (
                            <Trans id="checklist.status.pending" message="Pending" />
                        )}
                    </Typography>

                    <Button
                        size="small"
                        onClick={() => onDelete(item.checklistItemId)}
                        sx={{
                            fontSize: '0.75rem',
                            color: '#ef4444',
                            minWidth: 'auto',
                            p: 0.5,
                            '&:hover': {
                                bgcolor: '#fef2f2'
                            }
                        }}
                    >
                        <Trans id="checklist.delete" message="Delete" />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};