import { jwtDecode } from "jwt-decode";

function checkToken(navigate) {
    const token = localStorage.getItem('token');

    if (!token) {
        navigate('/login'); 
        return;
    }

    try {
        const decoded = jwtDecode(token); 
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            console.error('Token expired');
            localStorage.removeItem('token'); 
            navigate('/login');
        }
    } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        navigate('/login');
    }
}

export default checkToken;