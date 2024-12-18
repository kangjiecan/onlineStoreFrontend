import React from "react";

function Redirector() {
    // Function to handle redirection
    const handleRedirect = () => {
        const cognitoURL = `${import.meta.env.VITE_COGNITO_DOMAIN}/login?client_id=${import.meta.env.VITE_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`;
        window.location.href = cognitoURL;
    };

    return (
        <div>
            <button onClick={handleRedirect} className="btn btn-primary">
                login with cognito
            </button>
        </div>
    );
}

export default Redirector;