import { FC } from "react";
import { Navigate } from "react-router-dom";

interface protectedRouteProps {
    children: React.ReactNode,
    user: any
}

const ProtectedRoute:FC<protectedRouteProps> = ({ children, user }) => {
    if(!user){
        console.log(user);
        
        return <Navigate to="/login" replace/>;
    }
    return children;
}

export default ProtectedRoute;