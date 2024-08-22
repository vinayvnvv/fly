import {
  Box,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { stores } from '../../store';
import { useAtom } from 'jotai';
import { getFormattedSymbolName } from '../../common/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';

function PendingOrders({ pendingOrders, cancelOrder }) {
  const [symbols] = useAtom(stores.symbolsObjects);
  return (
    <Box width={'100%'}>
      {pendingOrders && pendingOrders.length > 0 && (
        <Box width={'100%'} mt={2}>
          <Typography>Open Orders</Typography>
          <Stack width={'100%'} mt={1}>
            <Card sx={{ p: 2 }}>
              <Stack
                mb={1}
                width={'100%'}
                direction={'row'}
                alignItems={'center'}
                color={'GrayText'}
              >
                <Typography width={'35%'} variant="caption">
                  Symbol
                </Typography>
                <Typography width={'10%'}>qty</Typography>
                <Typography width={'20%'}>price</Typography>
                <Typography width={'20%'}>Trigger</Typography>
                <Stack width={'15%'}></Stack>
              </Stack>
              <Divider />
              <Box mt={1}>
                {Array.isArray(pendingOrders) &&
                  pendingOrders.map(order => {
                    const symbol = symbols[order.instrument_token];
                    return (
                      <>
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          key={order.order_id}
                        >
                          <Typography width={'35%'} variant="caption">
                            {getFormattedSymbolName(symbol)}
                          </Typography>
                          <Typography width={'10%'}>
                            {order.quantity}
                          </Typography>
                          <Typography width={'20%'}>{order.price}</Typography>
                          <Typography width={'20%'}>
                            {order.trigger_price}
                          </Typography>
                          <Stack
                            width={'15%'}
                            direction={'row'}
                            alignItems={'center'}
                            spacing={0.2}
                          >
                            <IconButton>
                              <EditOutlined fontSize="small" />
                            </IconButton>

                            <IconButton
                              color="error"
                              onClick={() => cancelOrder(order.order_id)}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </>
                    );
                  })}
              </Box>
            </Card>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default PendingOrders;
