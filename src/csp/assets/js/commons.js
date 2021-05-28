// enable debug mode in SMART JS client lib
localStorage.debug = "FHIR.*";

function getFHIRClient() {
  // return FHIR.oauth2.ready()
  //     .then(client => client);
  return expiredTokenWorkaround()
    .then(client => client);
}

function expiredTokenWorkaround() {
  return FHIR.oauth2.ready()
    .then(client => {
      const accessToken = client.state.tokenResponse.access_token;
      const refreshToken = client.state.tokenResponse.refresh_token;
      const expiresAt = client.state.expiresAt || 0;

      if (!accessToken) {
        window.location.pathname = "/iris-on-fhir/launch.html";
      }
      if (accessToken && refreshToken && expiresAt - 10 < Date.now() / 1000) {
        window.location.pathname = "/iris-on-fhir/launch.html";
      }

      return client;
    })
    .catch(err => {
        if (err.message === "No 'state' parameter found. Please (re)launch the app.") {
            window.location.pathname = "/iris-on-fhir/launch.html";
        }
    });
}