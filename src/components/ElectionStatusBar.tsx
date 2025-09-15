import { Box, Paper, Typography, Avatar, Chip } from '@mui/material';
import { EmojiEvents, HowToVote } from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';

export const ElectionStatusBar = () => {
  const { candidates, results, totalVotes } = useAppSelector((state) => state.election);

  // Calculate electoral votes and popular vote totals
  const candidateStats = candidates.map(candidate => {
    const candidateResults = results.filter(r => r.candidateId === candidate.id);
    const popularVotes = candidateResults.reduce((sum, r) => sum + r.votes, 0);
    const electoralVotes = candidateResults.reduce((sum, r) => {
      // Get electoral votes from the result if available, otherwise estimate based on region
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
  const neededToWin = 270; // US Electoral College majority

  if (candidates.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mx: 2,
        mb: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <HowToVote sx={{ mr: 1, fontSize: 24 }} />
          <Typography variant="h5" fontWeight="bold">
            Election Results
          </Typography>
          {winner && winner.electoralVotes >= neededToWin && (
            <Chip
              icon={<EmojiEvents />}
              label="WINNER"
              color="warning"
              sx={{ ml: 2, fontWeight: 'bold' }}
            />
          )}
        </Box>

        {/* Main Results Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Electoral Votes ({totalElectoralVotes} total)
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Need {neededToWin} to win
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative', height: 60, borderRadius: 2, overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.1)' }}>
            {/* Electoral vote progress bars */}
            <Box sx={{ display: 'flex', height: '100%' }}>
              {candidateStats.map((candidate, index) => {
                const width = totalElectoralVotes > 0 ? (candidate.electoralVotes / 538) * 100 : 0; // 538 total electoral votes
                return (
                  <Box
                    key={candidate.id}
                    sx={{
                      width: `${width}%`,
                      bgcolor: candidate.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      borderRight: index < candidateStats.length - 1 ? '2px solid white' : 'none',
                    }}
                  >
                    {width > 8 && (
                      <Typography variant="h6" fontWeight="bold" color="white">
                        {candidate.electoralVotes}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
            
            {/* 270 marker line */}
            <Box
              sx={{
                position: 'absolute',
                left: `${(270 / 538) * 100}%`,
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: 'gold',
                zIndex: 10,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                left: `${(270 / 538) * 100}%`,
                top: -20,
                transform: 'translateX(-50%)',
                color: 'gold',
                fontWeight: 'bold',
                fontSize: '10px',
              }}
            >
              270
            </Typography>
          </Box>
        </Box>

        {/* Candidate Details */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {candidateStats.slice(0, 2).map((candidate, index) => (
            <Box
              key={candidate.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                justifyContent: index === 0 ? 'flex-start' : 'flex-end',
              }}
            >
              {/* Left candidate (leading) */}
              {index === 0 && (
                <>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      mr: 2,
                      bgcolor: candidate.color,
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {candidate.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {candidate.party}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={candidate.color}>
                      {candidate.electoralVotes}
                    </Typography>
                  </Box>
                </>
              )}

              {/* Right candidate */}
              {index === 1 && (
                <>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {candidate.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {candidate.party}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={candidate.color}>
                      {candidate.electoralVotes}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      ml: 2,
                      bgcolor: candidate.color,
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </>
              )}
            </Box>
          ))}
        </Box>

        {/* Popular Vote Summary */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.9 }}>
            Popular Vote: {totalVotes.toLocaleString()} total votes cast
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
            {candidateStats.map(candidate => (
              <Box key={candidate.id} sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {candidate.popularVotes.toLocaleString()} ({candidate.percentage.toFixed(1)}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};