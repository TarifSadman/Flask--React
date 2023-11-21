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
  HStack,
  Alert,
  AlertIcon,
  Table,
  Heading,
  Thead,
  Tbody,
  Tr,
  Th,
  Flex,
  Select,
  Td,
  Spinner,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button as ChakraButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    blood_group: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post('http://localhost:5000/api/add_data', formData)
      .then((response) => {
        console.log('Data stored successfully:', response.data);
        setFormData({
          name: '',
          email: '',
          message: '',
          blood_group: '',
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
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error storing data:', error);
        setLoading(false);
      });
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const editedData = submittedData.find((data) => data.id === id);
    setFormData(editedData);
  };

  const handleSave = (id) => {
    setLoading(true);
  
    axios
      .put(`http://localhost:5000/api/edit_data/${id}`, formData)
      .then(() => {
        setEditingId(null);
        setFormData({
          name: '',
          email: '',
          message: '',
          blood_group: '',
        });
  
        axios.get('http://localhost:5000/api/get_stored_data')
          .then((response) => {
            setSubmittedData(response.data.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching stored data:', error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        setLoading(false);
      });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      message: '',
      blood_group: '',
    });
  };

  const handleDelete = (id) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = () => {
    setLoading(true);

    axios
      .delete(`http://localhost:5000/api/delete_data/${deletingId}`)
      .then(() => {
        setSubmittedData((prevData) => prevData.filter((data) => data.id !== deletingId));
        setDeletingId(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
        setDeletingId(null);
        setLoading(false);
      });
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  return (
    <ChakraProvider>
      <Box p={8}>
        <VStack spacing={4} align="stretch">
        <Flex>
            <FormControl id="name" mr={4}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} />
            </FormControl>

            <FormControl id="blood_group">
              <FormLabel>Blood Group</FormLabel>
              <Select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                placeholder="Select blood group"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </Select>
            </FormControl>
          </Flex>

          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
          </FormControl>

          <FormControl id="message">
            <FormLabel>Message</FormLabel>
            <Textarea name="message" value={formData.message} onChange={handleChange} />
          </FormControl>

            <Button
              colorScheme="teal"
              size="lg"
              type="submit"
              onClick={handleSubmit}
              _hover={{ bg: 'teal.600' }}
              isDisabled={formData.name === '' || formData.email === '' || formData.message === '' || formData.blood_group === ''}
            >
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
              All Data
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
                      <Th>Blood Group</Th>
                      <Th>Email</Th>
                      <Th>Message</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {submittedData.map((data, index) => (
                      <Tr key={index}>
                        <Td>{editingId === data.id ? (
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        ) : (
                          data.name
                        )}
                        </Td>
                        <Td>{editingId === data.id ? (
                          <Select
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                            placeholder="Select blood group"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </Select>
                        ) : (
                          data.blood_group
                        )}</Td>
                        <Td>{editingId === data.id ? (
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        ) : (
                          data.email
                        )}</Td>
                        <Td>{editingId === data.id ? (
                          <Input
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                          />
                        ) : (
                          data.message
                        )}</Td>
                        <Td>
                        {editingId === data.id ? (
                          <HStack spacing={4} align="stretch">
                            <IconButton
                              colorScheme="green"
                              size="sm"
                              icon={<CheckIcon />}
                              onClick={() => handleSave(data.id)}
                              mr={2}
                            />
                            <IconButton
                              colorScheme="red"
                              size="sm"
                              icon={<CloseIcon />}
                              onClick={handleCancelEdit}
                            />
                          </HStack>
                        ) : (
                          <HStack spacing={2}>
                            <IconButton
                              colorScheme="teal"
                              size="sm"
                              icon={<EditIcon />}
                              onClick={() => handleEdit(data.id)}
                            />
                            <Popover>
                                <PopoverTrigger>
                                  <IconButton
                                    colorScheme="red"
                                    size="sm"
                                    icon={<DeleteIcon />}
                                    onClick={() => handleDelete(data.id)}
                                  />
                                </PopoverTrigger>
                                <PopoverContent>
                                  <PopoverHeader>Confirm Deletion</PopoverHeader>
                                  <PopoverBody>Are you sure you want to delete this item?</PopoverBody>
                                  <PopoverFooter d="flex" justifyContent="flex-end">
                                    <ChakraButton
                                      colorScheme="red"
                                      size="sm"
                                      onClick={handleConfirmDelete}
                                    >
                                      Confirm
                                    </ChakraButton>
                                    <ChakraButton
                            ml={2}
                            size="sm"
                            onClick={() => {
                              handleCancelDelete();
                            }}
                            onClose={() => handleCancelDelete()}
                          >
                            Cancel
                          </ChakraButton>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                      </HStack>
                        )}
                      </Td>
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
