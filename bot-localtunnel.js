var Botkit = require('botkit');
var localtunnel = require('localtunnel');
var Store = require('jfs');

var port = 3000;

var tunnel = localtunnel(port, function(err, tunnel) {
    if (err) console.log(err);

    var public_address = tunnel.url;
    var cisco_token = 'Y2NhOGI0YWUtNjY4Ny00NmIzLWI5MjktZmU5OWQzNmJlZGI0ODYyZjRmYzItNzU1';
    var studio_token = 'QQK3Nj9y0gFwMQiDFD3AWDimrCU38CLZu8Dvs1CIOYgr38WGb6CEkSd1BZW9DfX1';
    var secret = 'jeffrey';

    var controller = Botkit.sparkbot({
        // debug: true,
        // log: true,
        public_address: public_address,
        ciscospark_access_token: cisco_token,
        secret: secret,
        json_file_store: 'course.json'
    });



    var bot = controller.spawn({
    });

    

    var questions_db = new Store('course.json/questions', {saveId: 'id'});
    // storage
    controller.storage.questions ={
            get: function(question_id, cb) {
                questions_db.get(question_id, cb);
            },
            save: function(question, cb) {
                questions_db.save(question.id, question, cb);
            },
            delete: function(question_id, cb) {
                questions_db.delete(question_id, cb);
            },
            all: function(cb) {
                questions_db.all(objectsToList(cb));
            }
        };

    var quizzes_db = new Store('course.json/quizzes', {saveId: 'id'});
    // storage
    controller.storage.quizzes ={
            get: function(question_id, cb) {
                quizzes_db.get(question_id, cb);
            },
            save: function(question, cb) {
                quizzes_db.save(question.id, question, cb);
            },
            delete: function(question_id, cb) {
                quizzes_db.delete(question_id, cb);
            },
            all: function(cb) {
                quizzes_db.all(objectsToList(cb));
            }
        };

    controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
        controller.createWebhookEndpoints(webserver, bot, function() {
            console.log("SPARK: Webhooks set up!");
        });
    });

    controller.on('direct_mention', function(bot, message) {
        // bot.reply(message, 'You mentioned me and said, "' + message.text + '"');
        if( message.text == 'Last Poll') {

            bot.reply(message , {markdown:"Here are the list of polls your haven't answered.\n1. (kh62) What is your favorite color?\n2. (ggam) Favorite Game to Play?" , text: "Here are the list of polls your haven't answered"})

        } else if( message.text == 'All Files') {
            
            bot.reply(message , {markdown: "Helpful Files that you need:\n- (https://github.com/howdyai/botkit/blob/master/docs/readme-ciscospark.md)\n- (https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md)"
            });
        } else if( message.text == 'Quiz') {
            bot.reply(message , {markdown:"Here are the quizzes your haven't finish.\n1. (q10) Intro to Color Theory - 2 questions\n2. (ct2) Intro to Artificial Intelligence - 4 questions" , text: "Here are the list of quizzes your haven't finished"})            
        } else if( message.text == 'Top Quiz Master') {
            bot.reply(message , {markdown:"Here are your top students answering the quiz:\n1. jeffreymonte@yahoo.com ( Answered 2 quiz, 100% avg)" , text: "Here are the list of quizzes your haven't finished"})            
        }
    });

    controller.on('direct_message', function(bot, message) {
        // bot.reply(message, 'I got your private message. You said, "' + message.text + '"');

        // console.log('direct_message, ' + message.text);
        if( message.text == 'Last Poll') {

            bot.reply(message , {markdown:"Here are the list of polls your haven't answered.\n1. (kh62) What is your favorite color?\n2. (ggam) Favorite Game to Play?" , text: "Here are the list of polls your haven't answered"})

        } else if( message.text == 'All Files') {
            
            bot.reply(message , {markdown: "Helpful Files that you need:\n- (https://github.com/howdyai/botkit/blob/master/docs/readme-ciscospark.md)\n- (https://github.com/howdyai/botkit/blob/master/docs/readme-studio.md)"
            });
        } else if( message.text == 'Answer kh62') {
              bot.startConversation(message, function(err, convo) {

                convo.setVar('question_id','kh62');
                // convo.say('Did someone say cookies!?!!');
                convo.ask({markdown:"(kh62) What is your favorite color? \n1. Blue \n2. Green \n3. Red", text: 'What is your favorite color?' } , function(response, convo) {
                    console.log( convo.vars.question_id);
                    // convo.say('Golly, I love ' + response.text + ' too!!!');
                    switch(response.text) {
                        case "1":
                        case "2":
                        case "3":
                            controller.storage.questions.save({ id: 'sdfd', user_id: message.user, vote: response.text}, function(err) { console.log('Save'); });
                            convo.say({markdown:"Thank you for answering! Here are the result\n1. Blue **(80%)**\n2. Green **(10%)**\n3. Red **(10%)**", text:"Thank you for answering! Here are the result"});
                            convo.next();
                            break;
                        default:
                            convo.repeat();
                    }
                });

            });
        } else if( message.text == 'Broadcast File') {
              bot.startConversation(message, function(err, convo) {
                // convo.say('Did someone say cookies!?!!');
                convo.ask({markdown:"What is the url of the file?", text: 'What is the url of the file?' } , function(response, convo) {
                    controller.storage.questions.save({ id: 'sdfd', user_id: message.user, vote: response.text}, function(err) { console.log('Save'); });
                    convo.say({markdown:"File Successfully added!", text:"File Successfully added!"});
                });
            });
        } else if( message.text == 'Quiz') {
            bot.reply(message , {markdown:"Here are the quizzes your haven't finish.\n1. (q10) Intro to Color Theory - 2 questions\n2. (ct2) Intro to Artificial Intelligence - 4 questions" , text: "Here are the list of quizzes your haven't finished"})            
        } else if( message.text == 'Create Poll') {
            bot.startConversation(message, function(err, convo) {

                convo.setVar('question_id','kh62'); // random question_id
                // convo.say('Did someone say cookies!?!!');
                convo.ask({text: 'What is question or title?' } , function(response, convo) {
                    console.log( convo.vars.question_id);
                    convo.setVar('question_title',response.text); // random question_id

                    convo.ask({text: 'How about the choices separated by a comma?' } , function(response, convo) {
                    // convo.say('Golly, I love ' + response.text + ' too!!!');
                    var choices = response.split(",");
                    if( choices.length > 2) {
                        convo.say({markdown:"Poll created. Here is the question code: " + convo.vars.question_id});
                        controller.storage.questions.save({ id: 'sdfd', user_id: message.user, vote: response.text}, function(err) { console.log('Save'); });
                        convo.next();
                    } else {
                        convo.repeat();
                    }
                           
                     });
                });

            });
        } else if (message.text == 'Start q10') {
             bot.startConversation(message, function(err, convo) {
                var quiz_id = 'q10';
                var quizzes = [
                    {
                        num : 1,
                        title : 'What color is not a primary color?',
                        choices: [
                            "Blue",
                            "Green",
                            "Violet"
                        ]
                    },
                    {
                        num : 2,
                        title : 'What will you get if you combine yellow and red?',
                        choices: [
                            "Orange",
                            "Green",
                            "Blue"
                        ]
                    }
                ];

                convo.setVar('quizzes' , quizzes);
                convo.setVar('quiz_id' , quiz_id);

                for( var i = 0 ; i < quizzes.length ;i++) {
                    var quiz = convo.vars.quizzes[i];

                    convo.setVar('quiz_num' , quiz.num);
                    // convo.setVar('question_id','kh62');
                    // convo.say('Did someone say cookies!?!!');
                    var c = "";
                    for( var j in quiz.choices) {
                        c += "\n"+(j+1)+". " + quiz.choices[j];
                    }

                    convo.ask({markdown: "("+quiz.num +") "+quiz.title+" " + c, text: quiz.title } , function(response, convo) {
                        // console.log( convo.vars.question_id);
                        // console.log(response);
                        // console.log(convo);
                        switch(response.text) {
                            case "1":
                            case "2":
                            case "3":
                                controller.storage.quizzes.save({ id:message.user + "-" + convo.vars.quiz_id + "-" + convo.vars.quiz_num, user_id: message.user, num: convo.vars.quiz_num , vote: response.text}, function(err) { console.log('Save'); });
                                // convo.say({markdown:"Thank you for answering! Here are the result\n1. Blue **(80%)**\n2. Green **(10%)**\n3. Red **(10%)**", text:"Thank you for answering! Here are the result"});
                                convo.next();
                                break;
                            default:
                                convo.repeat();
                        }
               
                    });

                }
                 // convo.say('Golly, I love ' + response.text +  too!!!');
                
                
                convo.on('end', function(convo) {
                    console.log('Conversation End');
                    bot.reply(message, 'Thank you for finishing the quiz. You scored 2/2!');
                    // if (convo.status=='completed') {
                       
                    // } else {
                    //     // handle failed conversation
                    // }
                });

            });
        }
        
    });

});

tunnel.on('close', function() {
    // tunnels are closed
});
