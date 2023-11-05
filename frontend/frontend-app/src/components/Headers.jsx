

export const getAxiosConfig = () => {
    const jwtResponse = JSON.parse(localStorage.getItem("jwtResponse"));

    const token = jwtResponse.accessToken;
    console.log(token);
  return {
    headers: {
      Authorization: token,
      withCredentials: true,
    },
  };
};