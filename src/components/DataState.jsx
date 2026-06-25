import React from 'react';
import { Box, Card, Typography, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * DataState — shared "loading / error / content" wrapper used by every page.
 *
 *   <DataState loading={loading} error={error} onRetry={fetchData}>
 *     ...page content...
 *   </DataState>
 *
 * While loading → centered spinner. On error → friendly card with a Retry
 * button. Otherwise → renders the page content.
 */
export const DataState = ({ loading, error, onRetry, children }) => {
  /* Shared scrollable page shell — all states fill the available centre area */
  const pageShell = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 0,
    width: '100%',
  };

  if (loading) {
    return (
      <Box sx={{ ...pageShell, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress sx={{ color: '#EC8D20' }} />
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
          Loading data…
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ ...pageShell, alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center', py: 5, px: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Couldn't load data
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {error}
          </Typography>
          {onRetry && (
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700, textTransform: 'none', color: '#fff' }}
            >
              Retry
            </Button>
          )}
        </Card>
      </Box>
    );
  }

  /* Content — wrap in the page shell so every page scrolls correctly */
  return (
    <Box sx={pageShell}>
      {children}
    </Box>
  );
};

export default DataState;
