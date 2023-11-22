import axios from "axios";
import https from 'https';

const axiosInstance = axios.create({
    // Set the timeout in milliseconds
    timeout: 120000, // This sets the timeout to 5 seconds
  
    // Set the Axios Agent to keepAlive
    httpsAgent: new https.Agent({ keepAlive: true })
  });
  
  export default axiosInstance;