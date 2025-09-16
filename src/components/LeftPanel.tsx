import { useState } from 'react';
import { Box, Paper, Typography, Divider, Button, Stack } from '@mui/material';
import { PersonAdd, Upload, Api } from '@mui/icons-material';
import { CandidateList } from './CandidateList';
import { CandidateDialog } from './CandidateDialog';
import { MapSelector } from './MapSelector';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setImportDialog } from '../store/slices/uiSlice';

export const LeftPanel = () => {
  const dispatch = useAppDispatch();
  const displayMode = useAppSelector((state) => state.map.displayMode);
  const [candidateDialogOpen, setCandidateDialogOpen] = useState(false);

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
        <MapSelector />
        
        {displayMode === 'election' && (
          <>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Data Configuration
            </Typography>
            
            <Stack spacing={2} my={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Upload />}
                onClick={() => dispatch(setImportDialog(true))}
              >
                Upload Data (CSV/JSON)
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Api />}
                disabled
              >
                Configure Live API
              </Button>
            </Stack>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Candidates & Parties
            </Typography>
            
            <CandidateList />
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<PersonAdd />}
              sx={{ mt: 2 }}
              onClick={() => setCandidateDialogOpen(true)}
            >
              Add Candidate
            </Button>
          </>
        )}
      </Box>
      
      <CandidateDialog
        open={candidateDialogOpen}
        onClose={() => setCandidateDialogOpen(false)}
      />
    </Paper>
  );
};