//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const pug = require('pug');
const LinkedUserService = require('./LinkedUserService');
const HBLUsers = require('./HBLUsers');

var messengerButton = "<html><head><title>Facebook Messenger Bot </title></head><body><h1>Facebook Messenger Bot By Mursil Sayed</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<footer id=\"gWidget\"></footer><script src=\"https://widget.glitch.me/widget.min.js\"></script></body></html>";



// The rest of the code implements the routes for our Express server.
let app = express();
app.use(express.static('static'));//making the folder for static assets
app.set('view engine', 'pug');//setting the viewing engine to pug
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


//Variable for storing the User credentials for Linking
//let redirect_uri ='';
//let account_linking_token='';
//let page_scopped_user_id ='';
var linkService = new LinkedUserService();
var HBLUserService = new HBLUsers();

//let authorization_TOKEN ="312ewqkdjwqdj21034e09483";
//let account_linked=false;

//let linked_accounts=[];
let account_balance=1000;

//let linked_user_names ={};



  



app.get('/testfilerendering', function(req, res) {
  // Render a set of data
     let redirect_uri ="sample redirect uri";
  let account_linking_token = "sample linking token";
  
  const page = pug.renderFile('views/user-identity.pug',{ fbparams:{redirect_uri: redirect_uri, account_linking_token: account_linking_token }});
console.log(page);
  res.send(page);
  
});


app.get('/testviewrendering', function (req, res) {
   let redirect_uri ="sample redirect uri";
  let account_linking_token = "sample linking token";
  
  res.render('user-identity', { fbparams:{redirect_uri: redirect_uri, account_linking_token: account_linking_token } } );
  
});



app.get('/login', function(req, res) {
  
  //This method performs the following tasks
  //1- It will save the recieved query parameters as hidden form fields
  //2- It will create a template for Rendering Screen that will ask user to enter the userID and submit a button
  
  
  
  
  //1- Saving query parameters in global var
  let redirect_uri =req.query['redirect_uri'];
  let account_linking_token = req.query['account_linking_token'];
  
//   redirect_uri ="test url";
//   account_linking_token = "test_token";
  
  
  //2- It will create a template for Rendering Screen that will ask user to enter the userID and submit a button
  res.render('login', { fbparams:{redirect_uri: redirect_uri, account_linking_token: account_linking_token } } );

  
  
  
});

         
app.post('/auth', function(req, res) {

//This method performs the following tasks
  //1- It will send an error message to the user that account is already linked. 
  //2- In case of successful authentication, It will call the redirect_url and pass an authorization_code token to it. In case of failure, it will also call the re-direct url but will not send the token
  
 
  console.log(req.body);
  let hblid =req.body.HBLID;
  let fbparams= JSON.parse(req.body.fbparams);
  
  console.log('HBLID='+hblid);
  console.log('fbparams='+fbparams);
  console.log('fbparams.redirect_uri='+fbparams.redirect_uri);
  
  let result = HBLUserService.isUserLinked(hblid);
  
  if( result === false)
  {
       console.log("Account Validation Successful. Calling redirect url");
    //Calling fb redirect
    
    let requestPacket = {
    uri: fbparams.redirect_uri+'&authorization_code='+hblid,
    method: 'GET'
    };

    console.log("Calling Redirect URL, request Packet URL:"+requestPacket.uri);
    res.redirect(requestPacket.uri);
      
  }else if(result === true)
   {
     console.log(hblid+' is already linked with a facebook account');

     res.status(200).send(hblid+' is already linked with a facebook account'); 
   } 
  else// the account is already linked
  {
    console.log(result);
   res.status(200).send(result); 
    
  }
  
  
 
  

  
  
});












// Webhook validation
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

// Display the web page
// app.get('/', function(req, res) {

  
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write(loginHtml);
//   res.end();
  
  


// });


// Message processing
app.post('/webhook', function (req, res) {
  console.log(req.body);
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback) {
          receivedPostback(event);   
        } else if(event.account_linking)
          {
              receivedAccountLinkingPostBack(event);   

          }
        
        else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

// Incoming events handling
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the template example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;
      case 'login':
        sendLoginButton(senderID,'Please Connect Your HBL Mobile Account with chatbot');
        break;
      case 'account balance':
        getAccountBalance(senderID);
        break;
        
      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}


function receivedAccountLinkingPostBack(event) {
  
  var senderPSID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  console.log("Received Account Linking Call back URL;\n senderID=%s \n status=%s \n code=%s",event.sender.id, event.account_linking.status, event.account_linking.authorization_code);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  if(event.account_linking.status ==='linked')
  {
    let hblid = event.account_linking.authorization_code;

    linkService.linkHBLIDwithPSID(senderPSID,hblid);
    HBLUserService.setUserLink(hblid);
    sendTextMessage(senderPSID, "Account Linked. Welcome "+hblid+"!");
  }
  else // unlink user Account
  {
    let hblid = linkService.getHBLID(senderPSID);
    linkService.removeLink(senderPSID);
    HBLUserService.setUserLink(hblid,false);
    sendTextMessage(senderPSID, "Account Unlinked for user "+hblid);
  }

  
}




//////////////////////////
// Sending helpers
//////////////////////////

function getAccountBalance(recipientId) {
  
  let hblid = linkService.getHBLID(recipientId);
  
  
  if(hblid!==false)// Account linking found
  {
    //let hblid = linkService.getHBLID(recipientId);
    
    let accessAllowed = HBLUserService.isFBAccessAllowedForThisUser(hblid);
    let balance,messageText="";
    
    if(accessAllowed === true)
    {
      balance = HBLUserService.getAccountBalance(hblid);
      messageText = 'Dear '+hblid+", your Account Balance is Rs."+balance;
    }
    else
      messageText = 'Error! Dear '+hblid+" , "+accessAllowed;
    
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          text: messageText
        }
      };

      callSendAPI(messageData);
  }
  else // Account is not linked
    sendLoginButton(recipientId,'To Access your Account Balance,Please login');
    
}


function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}


function sendLoginButton(recipientId, displayMessage) {
  
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            
                    {
                    title: "HBL Mobile ChatBot",
                    subtitle: displayMessage,
                    
                    buttons: [
                      
                    
                      {
                        "type": "account_link",
                        "url": "https://quiver-territory.glitch.me/login"
                      },
                      {
                        "type": "account_unlink"
        
                        
                      }
                    
                    ]
                      

                    }
            
           
                  ]
        }
      }
    }
  };  

  callSendAPI(messageData);
}
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});