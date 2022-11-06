import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ReactTable from './Pages/ReactTable';

const App = () => {
  return (
    <ChakraProvider>
      <ReactTable />
    </ChakraProvider>
  )
}

export default App
