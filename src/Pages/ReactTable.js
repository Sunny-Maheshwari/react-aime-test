import React, { useEffect, useState } from "react";
import "../App.css";
import { useToast } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Icon,
  Select,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  ADD_USER,
  GET_USER,
  DELETE_USER,
  UPDATE_USER,
  GET_ALL_CITIES,
  GET_USER_BY_ID,
} from "../dataQuery";
import { Spinner } from "@chakra-ui/react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const ReactTable = () => {
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [cityId, setCityId] = useState();

  const [Response, setResponse] = useState(false);
  const toast = useToast();
  const [update_user, setUpdate_User] = useState(false);
  const getUser = useSubscription(GET_USER);
  const getUserbyId = useSubscription(GET_USER_BY_ID);
  const getcities = useSubscription(GET_ALL_CITIES);

  const [addUser] = useMutation(ADD_USER);
  const [delete_User] = useMutation(DELETE_USER);
  const [update_User] = useMutation(UPDATE_USER);

  const handleInputChange = (e) => {
    setName(e.target.value);
  };
  const handleInputChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleInputChangeRole = (e) => {
    setRole(e.target.value);
  };

  const handleInputChangeCity = (e) => {
    setCityId(e.target.value);
  };

  const updateUser = (data) => {debugger
    setUpdate_User(true);
    console.log("update_user", update_user);
    setOpenModal(true);
    setUserId(data.id);
    setName(data.name);
    setEmail(data.email);
    setRole(data.role);
    setCity(data.city);
    setCityId(data.city.id);
    getUserbyId({
      fetchPolicy: "no-cache",
      variables: {
        id: data.id,
      },
    }).then((res) => {debugger
      console.log("res", res);
    });
  };
  const delete_modal = (data) => {
    setUserId(data.id);
    setUserName(data.name);
    setCityId(data.city.id);
    setDeleteModal(true);
  };
  const deleteUser = () => {
    setDeleteModal(false);
    setResponse(true);
    delete_User({
      fetchPolicy: "no-cache",
      variables: {
        id: userId,
      },
    }).then((res) => {
      setResponse(false);
      // getUser.refetch();
      console.log(res);
      toast({
        title: "User deleted.",
        description: "User hasbeen deleted.",
        status: "success",
        duration: 1000,
        //isClosable: true,
      });
    });
  };

  const onOpen = () => {
    setUpdate_User(false);
    setName("");
    setEmail("");
    setRole("");
    setCity("");
    setCityId();
    setOpenModal(true);
  };
  const onClose = () => {
    setOpenModal(false);
    setDeleteModal(false);
  };
  const submit = () => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email?.match(regex)) {
      toast({
        title: "User updated.",
        description: "please enter a valid email address",
        status: "warning",
        duration: 1500,
        //isClosable: true,
      });
    } else {
      if (update_user == true) {debugger
        setResponse(true);
        setOpenModal(false);
        update_User({
          fetchPolicy: "no-cache",
          variables: {
            id: userId,
            name: name,
            role: role,
            email: email,
            cityId: cityId,
          },
        }).then((res) => {
          setResponse(false);
          // getUser.refetch();
          console.log(res);
          toast({
            title: "User updated.",
            description: "User hasbeen Updated.",
            status: "success",
            duration: 1500,
            //isClosable: true,
          });
        });
      } else {
        setResponse(true);
        setOpenModal(false);
        addUser({
          fetchPolicy: "no-cache",
          variables: {
            name: name,
            role: role,
            email: email,
            cityId: cityId,
          },
        }).then((res) => {
          // getUser.refetch();
          setResponse(false);
          console.log(res);
          toast({
            title: "User created.",
            description: "User hasbeen created.",
            status: "success",
            duration: 1500,
            //isClosable: true,
          });
        });
      }
    }
  };

  return (
    <>
      {Response == true && (
        <Spinner style={{ marginLeft: "50%", marginTop: "25%" }} />
      )}
      {Response == false && (
        <>
          <Button className="modalBtn" onClick={onOpen}>
            Open Modal
          </Button>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Role</Th>
                  <Th>Email</Th>
                  <Th>City</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {getUser.data?.customers.map((item) => (
                  <Tr>
                    <Td>{item.id}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.role}</Td>
                    <Td>{item.email}</Td>
                    <Td>{item.city.name}</Td>
                    <Button
                      className="delete"
                      onClick={() => {
                        delete_modal(item);
                      }}
                    >
                      <Icon as={DeleteIcon} />
                    </Button>
                    <Button
                      className="update"
                      onClick={() => {
                        updateUser(item);
                      }}
                    >
                      <Icon as={EditIcon} />
                    </Button>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* modal */}
      <Modal isOpen={openModal} closeOnOverlayClick={false} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {update_user == true ? (
            <ModalHeader> Update User </ModalHeader>
          ) : (
            <ModalHeader> Add User </ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={handleInputChange} type="name" />
              <FormLabel>Role</FormLabel>
              <Input
                value={role}
                onChange={handleInputChangeRole}
                type="role"
              />
              <FormLabel>City</FormLabel>
              <Select
                placeholder={
                  cityId == null || cityId == undefined
                    ? "Select City"
                    : city.name
                }
                onChange={handleInputChangeCity}
              >
                {getcities.data?.cities?.map((item) => (
                  <option key={item} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
              <FormLabel>Email address</FormLabel>
              <Input
                value={email}
                onChange={handleInputChangeEmail}
                type="email"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={submit}>
              Submit
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteModal} closeOnOverlayClick={false} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1>Are you sure you want to delete user {userName}</h1>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={deleteUser}>
              Delete
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReactTable;
