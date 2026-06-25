import { useContext, useRef, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import { HealthsoftContext } from '../context/HealthsoftContext';
import { useSearchParams } from 'react-router-dom';

export const LiveDashboard = () => {
  const {
    tickets,
    seniors,
    selectedTicketId,
    selectTicket,
    ribbonAck,
    setRibbonAck,
    closedTickets,
    resolvedTickets,
    toast,
    addLog
  } = useContext(HealthsoftContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const ticketFilter = searchParams.get('filter') || 'open';
  const setTicketFilter = (val) => setSearchParams({ filter: val });

  // Holds the pending snooze timer so it can be cleared on re-snooze / unmount.
  const snoozeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (snoozeTimerRef.current) {
        clearTimeout(snoozeTimerRef.current);
        snoozeTimerRef.current = null;
      }
    };
  }, []);

  // Helper calculations
  const openAlerts = tickets.filter(t => !closedTickets.has(t.id) && t.pri !== 'rv' && !resolvedTickets.has(t.id)).length;
  const resolvedToday = tickets.filter(t => resolvedTickets.has(t.id) || t.pri === 'rv').length;

  const isResolved = (t) => resolvedTickets.has(t.id) || t.pri === 'rv';

  // Ticket Filter criteria
  const filteredTickets = tickets.filter((t) => {
    if (closedTickets.has(t.id)) return false;
    const resolved = isResolved(t);
    if (ticketFilter === 'all') return true;
    if (ticketFilter === 'open') return !resolved;
    if (ticketFilter === 'resolved') return resolved;
    if (ticketFilter === 'sos') return t.type.toLowerCase().includes('sos') || t.type.toLowerCase().includes('fall');
    if (ticketFilter === 'geo') return t.type.toLowerCase().includes('geo');
    if (ticketFilter === 'hr') return t.type.toLowerCase().includes('heart') || t.type.toLowerCase().includes('abnormal');
    if (ticketFilter === 'dose') return t.type.toLowerCase().includes('dose') || t.type.toLowerCase().includes('missed');
    return true;
  });

  const ackRibbon = () => {
    setRibbonAck(true);
    addLog('MR', 'Ribbon acknowledged by <strong>Priya K.</strong>');
    toast('Alert acknowledged', 'warning');
  };

  const snoozeRibbon = () => {
    setRibbonAck('snoozed');
    toast('Alert snoozed for 10 minutes', 'info');
    // Clear any prior pending snooze so repeated snoozes don't stack.
    if (snoozeTimerRef.current) {
      clearTimeout(snoozeTimerRef.current);
    }
    snoozeTimerRef.current = setTimeout(() => {
      snoozeTimerRef.current = null;
      setRibbonAck(false);
      toast('⚠️ Snoozed alert back — Meenakshi Rajan', 'error');
    }, 600000);
  };

  const handleEscalate = () => {
    toast('Escalated to supervisor Ranjini S. ✓', 'error');
    addLog('MR', 'Alert <strong>escalated</strong> to supervisor');
  };

  // Stats Card data
  const stats = [
    { label: 'Seniors live',  value: Object.keys(seniors).length,          color: 'success.main', action: () => setTicketFilter('all') },
    { label: 'Open alerts',   value: openAlerts,   color: 'error.main',   action: () => setTicketFilter('open') },
    { label: 'Avg response',  value: '1m 42s',     color: 'primary.main', action: () => toast('Avg response: 1m 42s this shift', 'info') },
    { label: 'Resolved today',value: resolvedToday,color: 'text.primary', action: () => setTicketFilter('resolved') },
    { label: 'Low battery',   value: Object.values(seniors).filter(s => (s.devices?.band?.battery < 20) || (s.devices?.pendant?.battery < 20)).length,            color: 'info.main',    action: () => toast('Checking battery levels...', 'warning') }
  ];

  // Filter Pills mapping
  const filterPills = [
    { id: 'all', label: 'All' },
    { id: 'sos', label: 'SOS' },
    { id: 'geo', label: 'Geo-fence' },
    { id: 'hr', label: 'Wellness' },
    { id: 'dose', label: 'Medication' },
    { id: 'resolved', label: 'Resolved' }
  ];

  // Badge class map helper
  const getBadgeStyle = (badge) => {
    if (badge === 'b-sos')  return { bgcolor: 'rgba(232,101,74,0.12)',  color: '#E8654A' };
    if (badge === 'b-geo')  return { bgcolor: 'rgba(236,141,32,0.12)',  color: '#EC8D20' };
    if (badge === 'b-hr')   return { bgcolor: 'rgba(58,124,184,0.12)',  color: '#3A7CB8' };
    if (badge === 'b-dose') return { bgcolor: 'rgba(32,43,65,0.08)',    color: '#202B41' };
    return                         { bgcolor: 'rgba(74,140,111,0.12)',   color: '#4A8C6F' }; // b-ok
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      
      {/* P1 SOS Warning Ribbon */}
      {ribbonAck !== 'snoozed' && openAlerts > 0 && (
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1.5,
          py: 1.2,
          px: 2,
          flexShrink: 0,
          bgcolor: ribbonAck ? '#EC8D20' : '#E8654A',
          transition: 'background-color 0.2s'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
            <Box sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#fff',
              flexShrink: 0,
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.3 }
              }
            }} />
            <Typography sx={{ color: '#fff', fontSize: '12px', fontWeight: 600, flex: 1 }}>
              {ribbonAck 
                ? 'Acknowledged — Priya K. attending'
                : 'P1 SOS Alert — Fall/SOS detected · Respond immediately'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
            <Button
              onClick={ribbonAck ? handleEscalate : ackRibbon}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '10px',
                py: 0.5,
                px: 1.2,
                borderRadius: '5px',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' }
              }}
            >
              {ribbonAck ? 'Escalate' : 'Acknowledge'}
            </Button>
            <Button
              onClick={snoozeRibbon}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '10px',
                py: 0.5,
                px: 1.2,
                borderRadius: '5px',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' }
              }}
            >
              Snooze 10m
            </Button>
          </Box>
        </Box>
      )}

      {/* Stats Cards Row */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
        gap: 1,
        p: 1.8,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexShrink: 0
      }}>
        {stats.map((card) => (
          <Box
            key={card.label}
            onClick={card.action}
            sx={{
              textAlign: 'center',
              py: 1,
              px: 0.5,
              borderRadius: '8px',
              bgcolor: 'background.default',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <Typography sx={{
              fontSize: '18px',
              fontWeight: 800,
              fontFamily: '"Sora", sans-serif',
              lineHeight: 1.1,
              color: card.color
            }}>
              {card.value}
            </Typography>
            <Typography sx={{ fontSize: '9px', color: 'text.secondary', mt: 0.4, fontWeight: 600 }}>
              {card.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Filter Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        px: 1.8,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.primary', fontFamily: '"Sora", sans-serif' }}>
            Active tickets
          </Typography>
          <Chip
            label="MOCK"
            size="small"
            sx={{
              bgcolor: '#000000',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '8px',
              height: 14,
              borderRadius: '3px',
              px: 0.5,
              '& .MuiChip-label': { px: 0.5 }
            }}
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 0.5,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          maxWidth: { xs: '65vw', sm: 'auto' },
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {filterPills.map((pill) => {
            const active = ticketFilter === pill.id;
            return (
              <Chip
                key={pill.id}
                label={pill.label}
                onClick={() => setTicketFilter(pill.id)}
                sx={{
                  height: 22,
                  fontSize: '10px',
                  fontWeight: 600,
                  bgcolor: active ? 'secondary.main' : 'background.paper',
                  color: active ? 'secondary.contrastText' : 'text.secondary',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    color: active ? 'secondary.contrastText' : 'secondary.main',
                    bgcolor: active ? 'secondary.main' : 'action.hover'
                  },
                  '& .MuiChip-label': { px: 1.2 }
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Tickets List */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.2, display: 'flex', flexDirection: 'column', gap: 0.8, bgcolor: 'background.default' }}>
        {filteredTickets.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 3, fontSize: '12px' }}>
            No tickets match this filter
          </Typography>
        ) : (
          filteredTickets.map((t) => {
            // tickets use initials as sid (e.g. 'MR'), but real seniors are keyed by DB id.
            // Fallback: find by initials if direct key lookup fails.
            const senior = seniors[t.sid] || Object.values(seniors).find(s => s.initials === t.sid);
            const resolved = isResolved(t);
            const selected = selectedTicketId === t.id;

            let borderL = '3px solid';
            let borderLColor = 'divider'; // resolved / muted default
            if (!resolved) {
              if (t.pri === 'p1') borderLColor = '#E8654A';
              if (t.pri === 'p2') borderLColor = '#EC8D20';
            } else {
              borderLColor = '#4A8C6F';
            }

            const badgeStyle = getBadgeStyle(t.badge);

            return (
              <Card
                key={t.id}
                onClick={() => selectTicket(t.id, t.sid)}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  opacity: resolved ? 0.65 : 1,
                  boxShadow: selected ? '0 0 0 2px rgba(14,23,42,0.1)' : 'none',
                  borderColor: selected ? 'secondary.main' : (resolved ? 'divider' : borderLColor),
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  '&:hover': { borderColor: 'text.secondary' }
                }}
              >
                <CardContent sx={{ p: '9px 11px !important' }}>
                  
                  {/* Top line: Name & Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.primary' }}>
                      {senior?.name || 'Unnamed Senior'}
                    </Typography>
                    <Chip
                      label={t.type}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '9px',
                        fontWeight: 700,
                        borderRadius: '8px',
                        bgcolor: badgeStyle.bgcolor,
                        color: badgeStyle.color,
                        '& .MuiChip-label': { px: 0.8 }
                      }}
                    />
                  </Box>

                  {/* Middle line: Location */}
                  <Typography sx={{ fontSize: '10px', color: 'text.secondary', mb: 0.4 }}>
                    📍 {t.loc}
                  </Typography>

                  {/* Bottom line: Meta details */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                      sx={{ fontSize: '10px', color: 'text.secondary' }} 
                      dangerouslySetInnerHTML={{ __html: `${t.time} · ${t.extra}` }}
                    />
                    <Box sx={{
                      fontSize: '10px',
                      bgcolor: 'rgba(236,141,32,0.12)',
                      color: 'primary.main',
                      px: 1,
                      py: 0.2,
                      borderRadius: '8px',
                      fontWeight: 600
                    }}>
                      {t.agent}
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

    </Box>
  );
};

export default LiveDashboard;
