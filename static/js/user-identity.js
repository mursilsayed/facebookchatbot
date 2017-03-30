let authenticationUrl = 'auth';


$(document).ready(function() {

    $( "#submitBtn" ).click(function(e) {
      // Call the WebService for Authentication. If Authentication is successful, it will be redirected to fb.
      // In case of failure of Authentication, You will recieve an error message which will be displayed to the user. 
      
     

      // making the webservice call
    //  e.preventDefault();// preventing the default action of submitting the form
   //  let HBLID = $("#HBLID").
      let fbparams = $("#fbparams").val();
      let bodyData = {"HBLID": $("#HBLID").val(), 
                      "fbparams": $("#fbparams").val()};
    
      
      fetch(authenticationUrl ,{
                                method: 'post',
                                headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                                },
                                method: "POST",
                               //body: JSON.stringify({a: 1, b: 2})
                                body: JSON.stringify(bodyData)
                              })
      
        .then(function(response) {
           if(response.ok) {
            return response.text();
          }
          throw new Error('Network response was not ok. Error Description='+response.statusText );
        })
        .then(function(bodyText) {
             $("#errorMessage").text(bodyText);// Displaying the error Message
        })
        .catch(function(error) {
          
          $("#errorMessage").text("There has been a problem with your fetch operation. Details"+error);// Displaying the error Message
          
        });
      
      
    });

});

