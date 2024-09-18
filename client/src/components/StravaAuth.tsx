import { useLocation } from "react-router-dom";
import MySnackbar from "./MySnackbar";
import { api } from "../utils/http_requests";
import { API } from "../utils/consts";
import { UserPage } from "./UserPage";

const StravaAuth = () => {
    const location = useLocation();
    const search = location.search;
    const searchParams = new URLSearchParams(search);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return (
            <>
                {/* <h1>STRAVA Auth Error</h1> */}
                <UserPage />
                <MySnackbar message={`Error: ${error}`} severity='error' isOpen={true} period={5000} 
                    closeAction={(): void => {} } />
            </>
        )
    };
    
    if (code) {
        try {
            api.get_credentials(API.stravaConnect + search)
            return (
                <>
                    <h1>STRAVA Auth Successfully</h1>
                    <MySnackbar message={'Strava connected'} severity='success' isOpen={true} period={5000} 
                        closeAction={(): void => {} } />
                </>
            )
        } catch (error) {
            return (
                <>
                    <h1>STRAVA Auth Error</h1>
                    <MySnackbar message={`Error: ${error}`} severity='error' isOpen={true} period={5000} 
                        closeAction={(): void => {} } />
                </>
            )
        };
    }

    return (
        <div>
            <h1>Strava Auth undefined</h1>
        </div>
    )
};

export default StravaAuth;