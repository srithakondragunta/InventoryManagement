'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, TextField, Typography, Stack, IconButton, Paper, Container } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      bgcolor='#333'
      color='#fff'
      padding={4}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position='absolute'
          top='50%'
          left='50%'
          width={400}
          bgcolor='#444'
          color='#fff'
          border='2px solid #000'
          boxShadow={24}
          p={4}
          display='flex'
          flexDirection='column'
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant='h6'>Add Item</Typography>
          <Stack width='100%' direction='row' spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              sx={{ input: { color: '#fff' }, bgcolor: '#555', borderRadius: 1 }}
            />
            <IconButton
              color='primary'
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        </Box>
      </Modal>
      <Typography variant='h4' textAlign='center' marginBottom={2}>Inventory Management</Typography>
      <Stack direction='row' spacing={2} marginBottom={2} alignItems='center' width='100%' maxWidth='800px'>
        <TextField
          variant='outlined'
          placeholder='Search items'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ input: { color: '#fff' }, bgcolor: '#444', borderRadius: 1 }}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <IconButton color='primary' onClick={handleOpen}>
          <AddIcon />
        </IconButton>
      </Stack>
      <Paper elevation={3} sx={{ padding: 3, bgcolor: '#444', color: '#fff', borderRadius: 2, width: '100%', maxWidth: '800px' }}>
        <Stack width='100%' spacing={2} padding={2} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width='100%'
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              bgcolor='#555'
              padding={2}
              borderRadius={2}
            >
              <Typography variant='h6' color='#fff'>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant='h6' color='#fff'>
                {quantity}
              </Typography>
              <Stack direction='row' spacing={1}>
                <IconButton color='primary' onClick={() => addItem(name)}>
                  <AddIcon />
                </IconButton>
                <IconButton color='secondary' onClick={() => removeItem(name)}>
                  <RemoveIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

