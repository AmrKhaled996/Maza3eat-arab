import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
import { axiosInstance } from "../Apis/axiosInstence";
import type { MyJwtPayload } from "../Types/Amr'sTypes/config/JWTPayload";

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles?: string[];
}) {
  const token: string = axiosInstance.defaults.headers.common[
    "Cookie"
  ] as string;
  const rawtoken = token?.split("=")[1];
  const decoded: MyJwtPayload = jwtDecode(rawtoken) as MyJwtPayload;
  const role: string = decoded?.role as string;

  console.log(decoded);

  if (!token) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
