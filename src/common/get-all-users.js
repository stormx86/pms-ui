import {useEffect} from "react";
import UserService from "../services/user-service";

const getAllUsers = (setAllUsers) => {
    useEffect(() => {
        UserService.getAllUsers().then(
            response => {
                if (response.data !== null) {
                    setAllUsers(response.data);
                }
            }
        )
            .catch((error) => {
                    if (error.response) {
                        console.log(error.response);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                }
            );
    }, [])
};
export default getAllUsers;