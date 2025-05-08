import { jwtDecode } from "jwt-decode";

function decodeJWT(){
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    return decoded;
}


export default decodeJWT;