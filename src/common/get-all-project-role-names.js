import {useEffect} from "react";
import ProjectService from "../services/project-service";
import EventBus from "./event-bus";

const getAllProjectRoleNames = (setData) => {
    useEffect(() => {
        ProjectService.getAllProjectRoleNames().then(
            response => {
                setData(response.data);
            },
            error => {
                setData(
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString()
                );

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, [])
};
export default getAllProjectRoleNames;