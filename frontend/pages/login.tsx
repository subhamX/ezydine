import { useAuth0 } from '@auth0/auth0-react';
import HeadMeta from '../components/HeadMeta';

const Login = () => {
    const { loginWithRedirect } = useAuth0();
    return (
        <>
            <HeadMeta title='Login' />
            <div>
                Manager Login
            </div>
            <button onClick={() => loginWithRedirect()}>Log In</button>;
            <button onClick={() => loginWithRedirect()}>Sign up for a new account</button>
        </>
    )
}

export default Login;