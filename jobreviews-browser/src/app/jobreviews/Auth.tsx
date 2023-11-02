import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';



const Auth = () => {
    return (
        <Authenticator>
            {({ signOut,user }:any) => (
                <div>
                    <p>Welcome {user.username}</p>
                    <button onClick={signOut}>Sign out</button>
                </div>
            )}
        </Authenticator>
    );
};



export default Auth;
