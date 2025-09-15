import { Box, Paper, Typography, Avatar, Chip, Divider } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';

export const MapOverlayBar = () => {
  const { candidates, results, totalVotes } = useAppSelector((state) => state.election);

  // Calculate electoral votes and popular vote totals
  const candidateStats = candidates.map(candidate => {
    const candidateResults = results.filter(r => r.candidateId === candidate.id);
    const popularVotes = candidateResults.reduce((sum, r) => sum + r.votes, 0);
    const electoralVotes = candidateResults.reduce((sum, r) => {
      return sum + (r.electoralVotes || 0);
    }, 0);
    const percentage = totalVotes > 0 ? (popularVotes / totalVotes) * 100 : 0;
    
    return {
      ...candidate,
      popularVotes,
      electoralVotes,
      percentage,
    };
  });

  // Sort by electoral votes (descending)
  candidateStats.sort((a, b) => b.electoralVotes - a.electoralVotes);
  
  const winner = candidateStats[0];
  const totalElectoralVotes = candidateStats.reduce((sum, c) => sum + c.electoralVotes, 0);
  const neededToWin = 270;

  if (candidates.length === 0 || totalElectoralVotes === 0) {
    return null;
  }

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        minWidth: 400,
        maxWidth: 600,
      }}
    >
      {/* Main electoral bar */}
      <Box sx={{ position: 'relative', height: 8, bgcolor: 'grey.200' }}>
        {candidateStats.map((candidate, index) => {
          const width = (candidate.electoralVotes / 538) * 100; // 538 total electoral votes
          const leftOffset = candidateStats
            .slice(0, index)
            .reduce((sum, c) => sum + (c.electoralVotes / 538) * 100, 0);
          
          return (
            <Box
              key={candidate.id}
              sx={{
                position: 'absolute',
                left: `${leftOffset}%`,
                width: `${width}%`,
                height: '100%',
                bgcolor: candidate.color,
              }}
            />
          );
        })}
        
        {/* 270 marker */}
        <Box
          sx={{
            position: 'absolute',
            left: `${(270 / 538) * 100}%`,
            top: -2,
            bottom: -2,
            width: 2,
            bgcolor: 'warning.main',
            zIndex: 10,
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Leading candidate */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1.5,
                bgcolor: candidateStats[0]?.color,
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {candidateStats[0]?.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="bold" color="text.primary">
                {candidateStats[0]?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {candidateStats[0]?.party}
              </Typography>
            </Box>
          </Box>

          {/* Electoral votes display */}
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color={candidateStats[0]?.color}>
                  {candidateStats[0]?.electoralVotes}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Electoral
                </Typography>
              </Box>
              
              {winner && winner.electoralVotes >= neededToWin && (
                <Chip
                  icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                  label="WINNER"
                  color="warning"
                  size="small"
                  sx={{ fontSize: '10px', height: 20 }}
                />
              )}
              
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color={candidateStats[1]?.color}>
                  {candidateStats[1]?.electoralVotes || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Electoral
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {neededToWin} needed to win
            </Typography>
          </Box>

          {/* Second candidate */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="bold" color="text.primary">
                {candidateStats[1]?.name || 'Other'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {candidateStats[1]?.party || 'Candidates'}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                ml: 1.5,
                bgcolor: candidateStats[1]?.color || 'grey.400',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {candidateStats[1]?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'O'}
            </Avatar>
          </Box>
        </Box>

        {/* Popular vote summary */}
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
            Popular Vote: {candidateStats[0]?.percentage.toFixed(1)}% vs {candidateStats[1]?.percentage.toFixed(1)}% • {totalVotes.toLocaleString()} votes
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};