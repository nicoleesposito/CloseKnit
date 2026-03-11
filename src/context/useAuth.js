// put the google auth in it's own file because ESList kept giving errors.

import { useContext } from "react";
import AuthContext from "./AuthContext";

export function useAuth() {
    return useContext(AuthContext);
}
