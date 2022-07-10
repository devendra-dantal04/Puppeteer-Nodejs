const { init, login } = require('./credentials');

(async () => {

    //Initialize the browser
    await init();


    //Login to the instagram account
    await login();      
})();