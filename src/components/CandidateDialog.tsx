import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useAppDispatch } from '../hooks/redux';
import { addCandidate, updateCandidate } from '../store/slices/electionSlice';
import { Candidate } from '../types/election';

interface CandidateDialogProps {
  open: boolean;
  onClose: () => void;
  candidate?: Candidate | null;
}

export const CandidateDialog = ({ open, onClose, candidate }: CandidateDialogProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [color, setColor] = useState('#2196F3');

  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setParty(candidate.party);
      setColor(candidate.color);
    } else {
      setName('');
      setParty('');
      setColor('#' + Math.floor(Math.random()*16777215).toString(16));
    }
  }, [candidate, open]);

  const handleSave = () => {
    if (!name.trim()) return;

    const candidateData: Candidate = {
      id: candidate?.id || String(Date.now()),
      name: name.trim(),
      party: party.trim(),
      color,
    };

    if (candidate) {
      dispatch(updateCandidate(candidateData));
    } else {
      dispatch(addCandidate(candidateData));
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {candidate ? 'Edit Candidate' : 'Add Candidate'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Candidate Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Party"
            value={party}
            onChange={(e) => setParty(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              sx={{ flex: 1 }}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: 50, height: 40, cursor: 'pointer' }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!name.trim()}
        >
          {candidate ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};