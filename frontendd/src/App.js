import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [alertVisible, setAlertVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/store_data', formData)
      .then(response => {
        console.log('Data stored successfully:', response.data);
        setFormData({
          name: '',
          email: '',
          message: '',
        });
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
        }, 3000);
      })
      .catch(error => {
        console.error('Error storing data:', error);
      });
  };

  return (
    <ChakraProvider>
      <Box p={8}>
        <VStack spacing={4} align="stretch">
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} />
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
          </FormControl>

          <FormControl id="message">
            <FormLabel>Message</FormLabel>
            <Textarea name="message" value={formData.message} onChange={handleChange} />
          </FormControl>

          <Button colorScheme="teal" size="lg" type="submit" onClick={handleSubmit}>
            Submit
          </Button>

          {alertVisible && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              Data submitted successfully!
            </Alert>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
