import { Stack, styled } from '@mui/material';

const StyledBox = styled(Stack)(({ theme }) => ({
  [`& input`]: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    outline: 'none',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    width: '90px',
    height: '30px',
    borderRadius: 5,
    padding: '2px 8px',
  },
}));
const QuantityInput = ({ min, max, step, onChange, value }) => {
  const onValueChange = e => {
    let v = e.target.value;
    if (v) v = parseInt(v);
    if (v > max) {
      onChange(max);
      return;
    }
    onChange(v);
  };
  return (
    <StyledBox
      flexGrow={1}
      flexDirection={'row'}
      display={'flex'}
      justifyContent={'flex-end'}
    >
      <input
        type="number"
        onChange={onValueChange}
        min={min || 0}
        max={max || 900}
        step={step || 15}
        value={value}
      />
    </StyledBox>
  );
};
export default QuantityInput;
