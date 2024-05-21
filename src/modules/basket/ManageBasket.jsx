import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  styled,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { StyledTable } from '../../components/PostionsBar';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import { generateUID } from '../../common/utils';

const ColorInput = styled('input')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  width: '36px',
  height: '36px',
  borderRadius: '3px',
}));

const initValues = { name: '', color: '' };

const ManageBasket = ({ onClose, open }) => {
  const [form, setForm] = useState(initValues);
  const [editData, setEditData] = useState();
  let [basketsLists, setBasketsLists] = useAtom(stores.basketLists);
  if (!basketsLists) basketsLists = [];
  const onChangeForm = (key, e) => {
    setForm({ ...form, [key]: e.target.value });
  };
  const onSubmit = () => {
    if (editData) {
      if (form.name) {
        basketsLists[editData.idx]['name'] = form.name;
        basketsLists[editData.idx]['color'] = form.color;
        setBasketsLists([...basketsLists]);
        setForm(initValues);
        setEditData();
      }
      return;
    }
    if (form.name) {
      const values = { ...form, id: generateUID() };
      setBasketsLists([...basketsLists, values]);
      setForm(initValues);
    }
  };
  const editBasketData = (data, idx) => {
    setEditData({ ...data, idx });
    setForm({ name: data.name, color: data.color });
  };
  const deleteBasket = idx => {
    const basket = basketsLists
      .slice(0, idx)
      .concat(basketsLists.slice(idx + 1));
    setBasketsLists(basket);
    setForm(initValues);
  };

  console.log(basketsLists);
  return (
    <Dialog open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Baskets
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ minWidth: 500 }}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'left' }} size="small">
                name
              </TableCell>
              <TableCell size="small">color</TableCell>
              <TableCell size="small" />
            </TableRow>
          </TableHead>
          <TableBody>
            {basketsLists.map((tab, idx) => (
              <TableRow key={tab.id}>
                <TableCell>{tab.name}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: tab.color,
                      width: '23px',
                      height: '23px',
                      borderRadius: '40px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <IconButton
                      size={'small'}
                      onClick={() => editBasketData(tab, idx)}
                    >
                      <EditOutlined fontSize={'small'} />
                    </IconButton>
                    <IconButton
                      size={'small'}
                      onClick={() => deleteBasket(idx)}
                    >
                      <DeleteOutline fontSize={'small'} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
        <Stack
          direction={'row'}
          alignItems={'center'}
          spacing={2}
          mt={3}
          mb={1}
        >
          <TextField
            id="outlined-basic"
            label="Basket Name"
            variant="outlined"
            size="small"
            value={form.name}
            placeholder="Add Basket Name"
            onChange={e => onChangeForm('name', e)}
          />
          <ColorInput
            value={form.color}
            type="color"
            onChange={e => onChangeForm('color', e)}
          />
          <Button onClick={onSubmit} variant="contained">
            {editData?.name ? 'Edit' : 'Add'}
          </Button>
          {editData && (
            <IconButton
              size={'small'}
              onClick={() => {
                setEditData();
                setForm(initValues);
              }}
            >
              <CloseIcon fontSize={'small'} />
            </IconButton>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ManageBasket;
