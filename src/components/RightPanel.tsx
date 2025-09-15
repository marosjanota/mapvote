import { Box, Paper, Typography, LinearProgress, Stack, Chip } from '@mui/material';
import { useAppSelector } from '../hooks/redux';

export const RightPanel = () => {
  const { candidates, results, totalVotes, isLiveMode } = useAppSelector((state) => state.election);
  
  const getCandidateVotes = (candidateId: string) => {
    return results
      .filter(r => r.candidateId === candidateId)
      .reduce((sum, r) => sum + r.votes, 0);
  };

  const getCandidatePercentage = (candidateId: string) => {
    if (totalVotes === 0) return 0;
    return (getCandidateVotes(candidateId) / totalVotes) * 100;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: 300,
        height: '100%',
        overflow: 'auto',
        borderRadius: 0,
      }}
    >
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Election Status
          </Typography>
          {isLiveMode && (
            <Chip label="LIVE" color="error" size="small" />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total Votes: {totalVotes.toLocaleString()}
        </Typography>
        
        <Stack spacing={2} mt={3}>
          {candidates.map((candidate) => {
            const votes = getCandidateVotes(candidate.id);
            const percentage = getCandidatePercentage(candidate.id);
            
            return (
              <Box key={candidate.id}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1" fontWeight="medium">
                    {candidate.name}
                  </Typography>
                  <Typography variant="body2">
                    {percentage.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'grey.300',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: candidate.color,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {votes.toLocaleString()} votes
                </Typography>
              </Box>
            );
          })}
        </Stack>
        
        {candidates.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
            No candidates added yet
          </Typography>
        )}
      </Box>
    </Paper>
  );
};