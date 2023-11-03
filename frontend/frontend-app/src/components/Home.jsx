import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNavbar from './NavbarComp';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the JWT token is present in localStorage
    const jwtToken = localStorage.getItem('jwtResponse');
    
    // If not authenticated, redirect to the login page
    if (jwtToken == null) {
      console.log("heheh")
      navigate('/login');
    } else {
      console.log("wee")
      console.log(jwtToken);
    }
  }, [navigate]);

  const backgroundStyle = {
    backgroundImage: `url('https://external-preview.redd.it/M6I1JzqgXB9iUqJkh9SXcM-lcgjhT5GRQkHcdka0Lns.jpg?auto=webp&s=69047080d63afc8e80774d5f24258b2ade078f65')`,
    //backgroundImage: `url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f1ba3ad4-e8e7-4ff1-9220-86dc86878beb/d9cafik-05d24e66-2fdb-4a11-a173-a5579d3f253e.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2YxYmEzYWQ0LWU4ZTctNGZmMS05MjIwLTg2ZGM4Njg3OGJlYlwvZDljYWZpay0wNWQyNGU2Ni0yZmRiLTRhMTEtYTE3My1hNTU3OWQzZjI1M2UuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TLw678YtqTy6eBaFnZmDKuJcQKAGxqEzo-EzWArDOSY')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh',
    opacity: '1',
  };

  return (
    <div>
      <MyNavbar />
      <div style={backgroundStyle}>
        
        <div className="container">
          <div className="row">
            <h1>Welcome to the facility booking page</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;



