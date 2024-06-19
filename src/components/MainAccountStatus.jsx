import {
  Alert,
  Container,
  Typography,
  alertClasses,
  styled,
} from '@mui/material';
import { useAtom } from 'jotai';
import { stores } from '../store';

const SAlert = styled(Alert)(({}) => ({
  marginTop: '0px',
  marginBottom: '0px',
  padding: 0,
  height: '21px',
  position: 'fixed',
  top: -1,
  left: 0,
  width: '100%',
  zIndex: 1300,
  alignItems: 'center',
  borderRadius: 0,
  [`& .${alertClasses.message}`]: {
    padding: 0,
    width: '100%',
    borderRadius: 0,
  },
}));

const MainAccountStatus = () => {
  return (
    <SAlert sx={{}} icon={false} severity="warning" variant="filled">
      <Container>
        <Typography variant="caption" fontWeight={600}>
          Main Account Changed.
        </Typography>
      </Container>
    </SAlert>
  );
};
export default MainAccountStatus;
