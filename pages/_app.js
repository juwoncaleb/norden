<<<<<<< HEAD

import "../styles/global.scss";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
=======
import '../styles/global.scss'
import { ChakraProvider } from "@chakra-ui/react";


export default function App({ Component, pageProps }) {
  return (
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
   
>>>>>>> 9daf985870d7a2b0305c1acce048dbbefaae89e1
  );
}
