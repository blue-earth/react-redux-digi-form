import cookie from 'react-cookie';

const getCsrfToken = () => cookie.load('csrftoken');

export default getCsrfToken;
