import { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { removeCandidate } from '../store/slices/electionSlice';
import { CandidateDialog } from './CandidateDialog';
import { Candidate } from '../types/election';

export const CandidateList = () => {
  const candidates = useAppSelector((state) => state.election.candidates);
  const dispatch = useAppDispatch();
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);

  return (
    <List>
      {candidates.map((candidate) => (
        <ListItem key={candidate.id} sx={{ pr: 8 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: candidate.color,
              borderRadius: 1,
              mr: 2,
            }}
          />
          <ListItemText
            primary={candidate.name}
            secondary={candidate.party}
          />
          <ListItemSecondaryAction>
            <IconButton 
              edge="end" 
              size="small" 
              sx={{ mr: 1 }}
              onClick={() => setEditCandidate(candidate)}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              edge="end"
              size="small"
              onClick={() => dispatch(removeCandidate(candidate.id))}
            >
              <Delete fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      
      {editCandidate && (
        <CandidateDialog
          open={!!editCandidate}
          onClose={() => setEditCandidate(null)}
          candidate={editCandidate}
        />
      )}
    </List>
  );
};