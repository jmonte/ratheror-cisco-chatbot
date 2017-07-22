var Botkit = require('botkit');
var localtunnel = require('localtunnel');

var port = 3000;

var tunnel = localtunnel(port, function(err, tunnel) {
    if (err) console.log(err);
    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    // tunnel.url;






    var public_address = tunnel.url;
    var cisco_token = 'Y2NhOGI0YWUtNjY4Ny00NmIzLWI5MjktZmU5OWQzNmJlZGI0ODYyZjRmYzItNzU1';
    var studio_token = 'QQK3Nj9y0gFwMQiDFD3AWDimrCU38CLZu8Dvs1CIOYgr38WGb6CEkSd1BZW9DfX1';
    var secret = 'jeffrey';

    var controller = Botkit.sparkbot({
        debug: true,
        log: true,
        public_address: public_address,
        ciscospark_access_token: cisco_token,
        secret: secret,
        json_file_store: 'course.json'
    });


    var bot = controller.spawn({
    });

    controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
        controller.createWebhookEndpoints(webserver, bot, function() {
            console.log("SPARK: Webhooks set up!");
        });
    });

    // participants
    controller.hears('All Files', 'message_received,direct_message', function(bot, message) {
       // bot.reply(message, {
       //  attachments: [
       //      {
       //          contentType: 'image/png',
       //          contentUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Bender_Rodriguez.png',
       //          name: 'Bender_Rodriguez.png'
       //      }
       //  ]
       //  });
       controller.storage.users.save({id: message.user, foo:'bar'}, function(err) {  });
       bot.reply(message,{text: 'Hello', markdown: '*Hello!*'});
    });

    controller.on('direct_mention', function(bot, message) {
        bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
    });

    // controller.hears('Last Quizes', 'direct_message,direct_mention', function(bot, message) {

    // });

    // controller.hears('Active Contest', 'direct_message,direct_mention', function(bot, message) {

    // });

    // controller.hears('Send Feedback', 'direct_message,direct_mention', function(bot, message) {

    // });



    // // Admin Powers
    // controller.hears('Create Survey', 'direct_message,direct_mention', function(bot, message) {

    // });

    // controller.hears('Make Announcement', 'direct_message,direct_mention', function(bot, message) {

    // });

    // controller.hears('Question Sent', 'direct_message,direct_mention', function(bot, message) {

    // });

    // controller.hears('Broadcast File', 'direct_message,direct_mention', function(bot, message) {

    // });



    // controller.hears('hello', 'direct_message,direct_mention', function(bot, message) {
    //     bot.reply(message, 'Hi');
    // });

    // controller.on('direct_mention', function(bot, message) {
    //     bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
    // });

    controller.on('direct_message', function(bot, message) {
        // bot.reply(message, 'I got your private message. You said, "' + message.text + '"');

            console.log('start conversation');
              bot.startConversation(message, function(err, convo) {

                convo.setVar('question_id','kh62');
                // convo.say('Did someone say cookies!?!!');
                convo.ask({markdown:"#1 What is your favorite color? \n1. Blue \n2. Green \n3. Red", text: 'What is your favorite color?' } , function(response, convo) {
                    console.log( convo.vars.question_id);
                    convo.say('Golly, I love ' + response.text + ' too!!!');
                    switch(response.text) {
                        case "1":
                        case "2":
                        case "3":
                            controller.storage.questions.save({ id: 'sdfd', user_id: message.user, vote: response.text}, function(err) { console.log('Save'); });
                            break;
                        default:
                            convo.repeat();
                    }
                    convo.next();
                });

                //  convo.ask({markdown:"#2 What is your favorite color? \n1. Blue \n2. Green \n3. Red", text: 'What is your favorite color?' } , function(response, convo) {
                //     convo.say('Golly, I love ' + response.text + ' too!!!');
                //     convo.next();
                // });
            });
        
    });

});

tunnel.on('close', function() {
    // tunnels are closed
});
