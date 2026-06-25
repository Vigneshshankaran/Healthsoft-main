import { useContext, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { HealthsoftContext } from '../../context/HealthsoftContext';

export const ConfirmModal = () => {
  const { modalConfig } = useContext(HealthsoftContext);
  const [text, setText] = useState('');

  // Reset textarea on open/close
  useEffect(() => {
    if (modalConfig) {
      setText('');
    }
  }, [modalConfig]);

  if (!modalConfig) return null;

  const handleCancel = () => {
    modalConfig.onCancel();
  };

  const handleConfirm = () => {
    modalConfig.onConfirm(text);
  };

  // Determine placeholder based on type
  let placeholder = 'Optional note...';
  if (modalConfig.extraType === 'textarea_note') {
    placeholder = 'e.g. Spoke with senior — shaken but OK...';
  } else if (modalConfig.extraType === 'textarea_resolve') {
    placeholder = 'e.g. Confirmed safe — false alarm';
  }

  const isTextarea = modalConfig.extraType && modalConfig.extraType.startsWith('textarea');

  const handleKeyDown = (e) => {
    // Enter submits the modal, but only when there's no multi-line textarea
    // (so users can type newlines in note/resolve textareas). Escape is handled
    // by the Dialog's onClose, so we leave that path intact.
    if (e.key === 'Enter' && !e.shiftKey && !isTextarea) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog
      open={!!modalConfig}
      onClose={handleCancel}
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          maxWidth: '420px',
          width: 'calc(100% - 32px)',
          p: 1.5
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 800, color: 'text.primary', p: '14px 24px 6px' }}>
        {modalConfig.title}
      </DialogTitle>

      <DialogContent sx={{ p: '6px 24px 14px' }}>
        <Typography
          sx={{ fontSize: '12px', color: 'text.secondary', lineHeight: 1.6, mb: isTextarea ? 1.5 : 0 }}
          dangerouslySetInnerHTML={{ __html: modalConfig.body }}
        />
        
        {isTextarea && (
          <TextField
            multiline
            rows={modalConfig.extraType === 'textarea_note' ? 3 : 2}
            fullWidth
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{
              mt: 1.2,
              '& .MuiInputBase-root': {
                fontSize: '12px',
                color: 'text.primary',
                p: '8px 10px',
                bgcolor: 'action.hover',
                borderRadius: '7px'
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
            }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: '24px', pb: '14px', gap: 1 }}>
        <Button 
          onClick={handleCancel}
          sx={{
            px: 2.2,
            py: 1,
            fontSize: '12px',
            fontWeight: 700,
            bgcolor: 'background.default',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          autoFocus
          sx={{
            px: 2.2,
            py: 1,
            fontSize: '12px',
            fontWeight: 700,
            color: '#fff',
            bgcolor: modalConfig.confirmClass === 'error' ? '#C0392B' : '#1A7A4A',
            '&:hover': { bgcolor: modalConfig.confirmClass === 'error' ? '#A93226' : '#136038' }
          }}
        >
          {modalConfig.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
