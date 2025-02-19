import LogoutButton from '@/components/molecules/logout-button';
import whoami from '@/server-actions/auth/action_whoami';
import { IWhoamiResponse } from '@/server-actions/auth/action_whoami';

const HomePage = async () => {

  const user:IWhoamiResponse = await whoami();

  if (user.status === "notLoggedIn") {
    return (
      <div style={{ margin: '20px', padding: '20px' }}> 
        Home Sweet Home
        <br /> <br /> <br /> 
        Please log in to access the rest of the site.
      </div>
    );
  }
  else if (user.status === "unknown") {
    return (
      <div style={{ margin: '20px', padding: '20px' }}> 
        Home Sweet Home
        <br /> <br /> <br /> 
        An error determining your authentication status has occurred. Please try again later.
      </div>
    );
  }
  else if (user.status === "loggedIn") {
    return (
      <div style={{ margin: '20px', padding: '20px' }}> 
        Home Sweet Home
        <br /> <br /> <br /> 
        <LogoutButton />
      </div>
    );
  }
  else {
    return (
      <div style={{ margin: '20px', padding: '20px' }}> 
        Home Sweet Home
        <br /> <br /> <br /> 
        An unknown has occurred. Please try again later.
      </div>
    );
  }
}

export default HomePage;