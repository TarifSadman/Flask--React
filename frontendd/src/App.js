import React, { useEffect, useState } from 'react';
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
  Table,
Heading,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/get_stored_data')
      .then((response) => {
        setSubmittedData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching stored data:', error);
      });
  }
  , []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post('http://localhost:5000/api/store_data', formData)
      .then((response) => {
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

        axios.get('http://localhost:5000/api/get_stored_data')
          .then((response) => {
            setSubmittedData(response.data.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching stored data:', error);
          });
      })
      .catch((error) => {
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

          <Box mt={8}>
          <Heading as="h2" size="lg" mb={4} style={{ textAlign: 'center' }}>
              Submitted Data
          </Heading>
          <Box position="relative">
              {loading && (
                <Spinner
                  size="xl"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                />
              )}

              {!loading && (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Message</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {submittedData.map((data, index) => (
                      <Tr key={index}>
                        <Td>{data.name}</Td>
                        <Td>{data.email}</Td>
                        <Td>{data.message}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
