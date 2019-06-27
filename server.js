const Discord = require("discord.js");
const bot = new Discord.Client();
const botconfig = require("./botconfig.json");
const superagent = require("superagent");
const coins = require("./coins.json");
const fs = require('fs');

let reg = 20;
let cheapRole = 100;
let mediumRole = 1000;
let expensiveRole = 10000;
let amazingRole = 2000000;
let discounted = .5;

var generalPrompts = [ "What was the last funny video you saw?",
        "What do you do to get rid of stress?",
        "What is something you are obsessed with?",
        "What three words best describe you?",
        "What would be your perfect weekend?",
        "What’s your favorite number? Why?",
        "What’s the most useful thing you own?",
        "What’s your favorite way to waste time?",
        "Do you have any pets? What are their names?",
        "Where did you go last weekend? What did you do?",
        "What are you going to do this weekend?",
        "What is something that is popular now that annoys you?",
        "What did you do on your last vacation?",
        "When was the last time you worked incredibly hard?",
        "What do you do when you hang out with your friends?", "Who is your oldest friend? Where did you meet them?", "What’s the best / worst thing about your work / school?", "If you had intro music, what song would it be? Why?", "What were you really into when you were a kid?", "If you could have any animal as a pet, what animal would you choose?", "Have you ever saved an animal’s life? How about a person’s life?", "If you opened a business, what kind of business would it be?", "Who is your favorite entertainer (comedian, musician, actor, etc.)?", "Are you a very organized person?", "Have you ever spoken in front of a large group of people? How did it go?", "What is the strangest dream you have ever had?", "What is a controversial opinion you have?", "Who in your life brings you the most joy?", "Who had the biggest impact on the person you have become?", "What is the most annoying habit someone can have?", "Where is the most beautiful place you have been?", "Where do you spend most of your free time / day?", "Who was your best friend in elementary school?", "How often do you stay up past 3 a.m.?", "What’s your favorite season? Why?", "Which is more important, a great car or a great house? Why?", "What animal or insect do you wish humans could eradicate?", "Where is the most beautiful place near where you live?", "What do you bring with you everywhere you go?", "How much time do you spend on the internet? What do you usually do?", "What is the most disgusting habit some people have?", "Where and when was the most amazing sunset you have ever seen?", "Which recent news story is the most interesting?", "Where is the worst place you have been stuck for a long time?", "If you had to change your name, what would your new name be?", "What is something that really annoys you but doesn’t bother most people?", "What word or saying from the past do you think should come back?", "How should success be measured? By that measurement, who is the most successful person you know?"]; //50

var moviePrompts = ["What is the most overrated movie?", "What’s your favorite genre of movie?", "Which do you prefer? Books or movies?", 
"What movie scene choked you up the most?", "Do you like documentaries? Why / why not?", "What’s the worst movie you have seen recently?", "What’s the strangest movie you have ever seen?", "Do you like horror movies? Why or why not?", "When was the last time you went to a movie theater?", "What was the last movie you watched? How was it?", "Do movies have the same power as books to change the world?", "Do you prefer to watch movies in the theater or in the comfort of your own home?"]; //12

var bookPrompts = ["What was the last book you read?", "What was your favorite book as a child?", "Do you prefer physical books or ebooks?", "What is the longest book you have read?", "What book genres do you like to read?", "Do you prefer fiction or nonfiction books?", "What book has influenced you the most?", "How fast do you read?", "How often do you go to the library?", "What book has had the biggest impact on your life?", "What book has had the biggest effect on the modern world?", "What was the worst book you had to read for school? How about the best book you had to read for school?", "Do you think people read more or less books now than 50 years ago?", "Now that indie publishing has become easier, have books gotten better or worse?"]; //14

var musicPrompts = ["What song always puts you in a good mood?", "What’s the best way to discover new music?", "What was the last song you listened to?", "What is your favorite movie soundtrack?", "Do you like classical music?", "How has technology changed the music industry?", "Are there any songs that always bring a tear to your eye?", "What bands or types of music do you listen to when you exercise?", "Which do you prefer, popular music or relatively unknown music?", "Do you like going to concerts? Why or why not? What was the last concert you went to?", "Who was the first band or musician you were really into? Do you still like them?", "Records, tapes, CDs, MP3s. Which did you grow up with? What is good and bad about each?"]; //12

var appPrompts = ["What are the three best apps on your phone?", "What is the most useful app on your phone?", "What apps have changed your life a lot?", "What do app makers do that really annoys you?", "How many apps do you have on your phone?", "What is the most annoying app you have tried?", "What’s the most addictive mobile game you have played?", "Which app seemed like magic the first time you used it?", "What is the strangest app you have heard of or tried?", "Which app has helped society the most? Which one has hurt society the most?", "An app mysteriously appears on your phone that does something amazing. What does it do?"]; //11

var sportsPrompts = ["What sports do you like to watch?", "Who are some of your favorite athletes?", "Which sports do you like to play?", "What is the hardest sport to excel at?", "Who are the 3 greatest athletes of all time?", "What do you think the oldest sport still being played is?", " How much time do you spend watching sports in a week?", "Do athletes deserve the high salaries they receive? Why or why not?", "What defines a sport? Is fishing a sport? How about video game tournaments?", "Why do you think sports are common across almost all cultures present and past?", "Do you play sports video games? Which ones? Is playing the video game or sport more fun? Why?", "Which sport is the most exciting to watch? Which is the most boring to watch?"]; //12

var travelPrompts = ["Where would you like to travel next?", "What is the longest plane trip you have taken?", "What’s the best way to travel? (Plane, car, train, etc.)", "Where is the most relaxing place you have been?", "Do you prefer traveling alone or with a group?", "What do you think of tour group packages?", "Do you prefer to go off the beaten path when you travel?", "What was the most over hyped place you’ve traveled to?", "Have you traveled to any different countries? Which ones?", "Where is the most awe inspiring place you have been?", "What’s the best thing about traveling? How about the worst thing?", "What is the worst hotel you have stayed at? How about the best hotel?", "How do you think traveling to a lot of different countries changes a person?", "Talk about some of the interesting people you have met while traveling.", "What do you think of stay-cations? (Vacationing and seeing tourist attractions where you live.)", "Where do you get your recommendations for what to do and where to stay when you travel?"]; //16

var techPrompts = ["What is your favorite piece of technology that you own?", "What piece of technology is really frustrating to use?", "What was the best invention of the last 50 years?",  "Does technology simplify life or make it more complicated?", "Will technology save the human race or destroy it?", "Which emerging technology are you most excited about?", "What scifi movie or book would you like the future to be like?", "What do you think the next big technological advance will be?", "What technology from a science fiction movie would you most like to have?", "What problems will technology solve in the next 5 years? What problems will it create?", "What piece of technology would look like magic or a miracle to people in medieval Europe?", "Can you think of any technology that has only made the world worse? How about a piece of technology that has only made the world better?"]; //12

var fashionPrompts = ["What is your favorite shirt?", "Does fashion help society in any way?", "What old trend is coming back these days?", "What is a fashion trend you are really glad went away?", "What is the most comfortable piece of clothing you own?", "What is the most embarrassing piece of clothing you own?", "How do clothes change how the opposite sex views a person?", "Do you care about fashion?", "What style of clothes do you usually wear?", "If you didn’t care at all what people thought of you, what clothes would you wear?", "What is the best pair of shoes you have ever owned? Why were they so good?", "Who do you think has the biggest impact on fashion trends: actors and actresses, musicians, fashion designers, or consumers?"]; //12

var goalPrompts = ["What personal goals do you have?", "What are your goals for the next two years?", "How have your goals changed over your life?", "How much do you plan for the future?", "How do you plan to make the world a better place?", "What are some goals you have already achieved?", "What do you hope to achieve in your professional life?", "Have your parents influenced what goals you have?", "Do you usually achieve goals you set? Why or why not?", "What is the best way to stay motivated and complete goals?", "What are some goals you have failed to accomplish?", "What is the craziest, most outrageous thing you want to achieve?", "When do you want to retire? What do you want to do when you retire?"]; //13

bot.login(botToken);


bot.on("ready", () => {
    console.log(`${bot.user.tag} is Online!`)
    bot.user.setActivity("?help");
});



bot.on("message", async message => {
    if(message.author.bot) return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let question = args.slice(0).join(" ");
    let personCoin = coins[message.author.id].coins;
    let Discount = message.guild.roles.find("name", "Discount");
    let Free = message.guild.roles.find("name", "Free");
    let Movie = message.guild.roles.find("name", "Movie");
    let Book = message.guild.roles.find("name", "Book");
    let Travel = message.guild.roles.find("name", "Travel");
    let Sports = message.guild.roles.find("name", "Sports");
    let App = message.guild.roles.find("name", "App");
    let Goal = message.guild.roles.find("name", "Goal");
    let Fashion = message.guild.roles.find("name", "Fashion");
    let Tech = message.guild.roles.find("name", "Tech");
    let Music = message.guild.roles.find("name", "Music");
    let Pair = message.guild.roles.find("name", "Pair");
    let Double = message.guild.roles.find("name", "Double");
  
  
  if(cmd === "?help"){
    message.channel.send("```My prefix is ?\n----------\nREGULAR COMMANDS\n----------\nhelp - Cost: 0 - Brings up all of the commands I have!\ncoins - Cost: 0 - the number of coins you have!\npair - Cost: Role - will pair you with a random online person to talk to, if the random person is offline, try again!\ncat - Cost: 20 - shows a random picture of a cat!\nmeme - Cost: 20 - shows a random meme!\navatar - Cost: 20 - shows the avatar of the person you pinged!\nchat - Cost: 20 - the bot will reply to whatever you say!\nsay - Cost: 20 - I will say what you type!\n----------\nPROMPTS (all prompts come from https://conversationstartersworld.com/)\n----------\ngeneral - Cost: 0 - a general prompt to get people talking!\nMusic - Gives a music prompt if you have the role!\nBook - Gives a book prompt if you have the role!\nSports - Gives a sport prompt if you have the role!\nTravel - Gives a travel prompt if you have the role!\nTech - Gives a tech prompt if you have the role!\nGoal - Gives a goal prompt if you have the role!\nApp - Gives an app prompt if you have the role!\nFashion - Gives a fashion prompt if you have the role!\n----------\n?prompt [prompt type (case sensitive)]\n----------\nROLES\n----------\nDiscount - Cost: 1000 - makes regular commands half off\nFree - Cost: 10000 - makes regular commands free\nPair - Cost: 10000 - Gives acces to the pair command\nTravel - Cost: 100 - Gives acess to travel prompts\nMusic - Cost: 100 - Gives access to music prompts\nBook - Cost: 100 - Gives access to book prompts\nTech - Cost: 100 - Gives access to tech prompts\nGoal - Cost: 100 - Gives access to goal prompts\nApp - Cost: 100 - Gives access to app prompts\nSports - Cost: 100 - Gives access to sports prompts\nFashion - Cost: 100 - Gives access to fashion prompts\n----------\n?buy [role name you want to buy, case sensitive]```");
  }
  
  //start of pair command
  if(cmd === '?pair' && message.member.roles.has(Pair.id)){
    let rando = message.guild.members.random();
    console.log(rando.presence.status);
    if(rando.presence.status == "online"){
        message.channel.send(`<@${rando.id}> you're being summoned!`);
    }else if(rando.presence.status == "offline"){
      message.channel.send("Bad luck! try again!");
    }
  }else if(cmd === '?pair' && !message.member.roles.has(Pair.id)){
    message.channel.send("You don't have this role!")
  }
  //end of pair command
  
  //start of prompt command
  if(cmd === '?prompt'){
    if(question === 'general'){
      message.channel.send(generalPrompts[Math.floor(Math.random() * 49)]);
    }else if(question === 'Travel' && message.member.roles.has(Travel.id)){
      message.channel.send(travelPrompts[Math.floor(Math.random() * 15)]);
    }else if(question === 'Music' && message.member.roles.has(Music.id)){
      message.channel.send(musicPrompts[Math.floor(Math.random() * 11)]);
    }else if(question === 'Book' && message.member.roles.has(Book.id)){
      message.channel.send(bookPrompts[Math.floor(Math.random() * 13)]);
    }else if(question === 'Tech' && message.member.roles.has(Tech.id)){
      message.channel.send(techPrompts[Math.floor(Math.random() * 11)]);
    }else if(question === 'Goal' && message.member.roles.has(Goal.id)){
      message.channel.send(goalPrompts[Math.floor(Math.random() * 12)]);
    }else if(question === 'App' && message.member.roles.has(App.id)){
      message.channel.send(appPrompts[Math.floor(Math.random() * 10)]);
    }else if(question === 'Sports' && message.member.roles.has(Sports.id)){
      message.channel.send(sportsPrompts[Math.floor(Math.random() * 11)]);
    }else if(question === 'Fashion' && message.member.roles.has(Fashion.id)){
      message.channel.send(fashionPrompts[Math.floor(Math.random() * 11)]);
    }else{
      message.channel.send("You either don't have that role or need to specify what kind of prompt you want.");
    }
  }
  
  //start of say command
      if(cmd === '?say' && message.member.roles.has(Free.id)){
                let order = args.join(" ").slice(0);
      message.delete(0);

        return message.channel.send(`${order}`);
      }else if(cmd === '?say' && personCoin >= reg && !message.member.roles.has(Discount.id)){
        
                                            coins[message.author.id] = {
          coins: coins[message.author.id].coins -= reg
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let order = args.join(" ").slice(0);
      message.delete(0);

        return message.channel.send(`${order}`);
        
    }else if(cmd === '?say' && message.member.roles.has(Discount) && personCoin >= (reg * discounted)){
                                                         coins[message.author.id] = {
          coins: coins[message.author.id].coins -= (reg * discounted)
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
      
              let order = args.join(" ").slice(0);
      message.delete(0);

        return message.channel.send(`${order}`);
      
             }else if(cmd === '?say' && personCoin < reg){
      message.channel.send("You don't have enough coins!");
    }
  
  //end of say command
  
  //start of avatar command
  
    if(cmd === '?avatar' && message.member.role.has(Free.id)){
                   let AUser = message.mentions.users.first();
      if(!AUser){
        message.channel.send("Can't find user!");
      }
    
    let avatar = new Discord.RichEmbed()
    .setImage(AUser.avatarURL);
    
    message.channel.send(avatar);
       }else if(cmd === '?avatar' && personCoin >= reg){
      
                                    coins[message.author.id] = {
          coins: coins[message.author.id].coins -= reg
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
             let AUser = message.mentions.users.first();
      if(!AUser){
        message.channel.send("Can't find user!");
      }
    
    let avatar = new Discord.RichEmbed()
    .setImage(AUser.avatarURL);
    
    message.channel.send(avatar);
  }else if(cmd === '?avatar' && message.member.roles.has(Discount.id) && personCoin >= (reg * discounted)){
                                                         coins[message.author.id] = {
          coins: coins[message.author.id].coins -= (reg * discounted)
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
             let AUser = message.mentions.users.first();
      if(!AUser){
        message.channel.send("Can't find user!");
      }
    
    let avatar = new Discord.RichEmbed()
    .setImage(AUser.avatarURL);
    
    message.channel.send(avatar); 
      
             }else if(cmd === '?avatar' && personCoin < reg){
    message.channel.send("You don't have enough coins!");
  }
  
  //end of avatar command
  
  //start of meme command
  
        if(cmd === '?meme' && message.member.roles.has(Free.id)){
          let msg = await message.channel.send("Summoning...")
          
                let {body} = await superagent
      .get("https://some-random-api.ml/meme")
      if(!{body}) return message.channel.send("Welp, I lost it")
      let cEmbed = new Discord.RichEmbed()
      .setTitle(body.caption)
      .setImage(body.image);
      
      msg.delete();
      message.channel.send(cEmbed);
        }else if( cmd === '?meme' && personCoin >= reg){
      let msg = await message.channel.send("Summoning...")
      
                              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= reg
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
      
      let {body} = await superagent
      .get("https://some-random-api.ml/meme")
      if(!{body}) return message.channel.send("Welp, I lost it")
      let cEmbed = new Discord.RichEmbed()
      .setTitle(body.caption)
      .setImage(body.image);
      
      msg.delete();
      message.channel.send(cEmbed);
    }else if(cmd === '?meme' && message.member.roles.has(Discount.id) && personCoin >= (reg * discounted)){
      
      let msg = await message.channel.send("Summoning...")
      
                                                         coins[message.author.id] = {
          coins: coins[message.author.id].coins -= (reg * discounted)
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
      
            let {body} = await superagent
      .get("https://some-random-api.ml/meme")
      if(!{body}) return message.channel.send("Welp, I lost it")
      let cEmbed = new Discord.RichEmbed()
      .setTitle(body.caption)
      .setImage(body.image);
      
      msg.delete();
      message.channel.send(cEmbed);
     }else if(cmd === '?meme' && personCoin < reg){
      message.channel.send("You don't have enough coins!");
    }
  
  //end of meme command
  
  //start of chat command
  
        if(cmd === '?chat' && message.member.roles.has(Free.id)){
          message.channel.startTyping();
          
                let question = args.slice(0).join(" ");
      let {body} = await superagent
      .get("https://some-random-api.ml/chatbot/?message="+question)
      if(!{body}) return message.channel.send("Welp, I lost it")
      
      message.channel.stopTyping();
      message.channel.send(body.response);
        }else if( cmd === '?chat' && personCoin >= reg){
      message.channel.startTyping();
          
                        coins[message.author.id] = {
          coins: coins[message.author.id].coins -= reg
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        
      let question = args.slice(0).join(" ");
      let {body} = await superagent
      .get("https://some-random-api.ml/chatbot/?message="+question)
      if(!{body}) return message.channel.send("Welp, I lost it")
      
      message.channel.stopTyping();
      message.channel.send(body.response);
    }else if(cmd === '?chat' && message.member.roles.has(Discount.id) && personCoin >= (reg * discounted)){
      
      let msg = await message.channel.send("Summoning...")
      
                                                         coins[message.author.id] = {
          coins: coins[message.author.id].coins -= (reg * discounted)
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
      
            let question = args.slice(0).join(" ");
      let {body} = await superagent
      .get("https://some-random-api.ml/chatbot/?message="+question)
      if(!{body}) return message.channel.send("Welp, I lost it")
      
      message.channel.stopTyping();
      message.channel.send(body.response);
      
    }else if(cmd === '?chat' && personCoin < reg){
      message.channel.send("Sorry, you don't have enough coins!");
    }
  
  //end of chat command
  
  //start of cat command
  
      if(cmd === '?cat' && message.member.roles.has(Free.id)){
        let msg = await message.channel.send("Summoning...")
        
              let {body} = await superagent
      .get("http://aws.random.cat/meow")
      if(!{body}) return message.channel.send("Welp, I lost it")
      let cEmbed = new Discord.RichEmbed()
      .setImage(body.file);
      
      msg.delete();
      message.channel.send(cEmbed);
      }else if( cmd === '?cat' && coins[message.author.id].coins >= reg){
      let msg = await message.channel.send("Summoning...")
      
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= reg
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
      
      let {body} = await superagent
      .get("http://aws.random.cat/meow")
      if(!{body}) return message.channel.send("Welp, I lost it")
      let cEmbed = new Discord.RichEmbed()
      .setImage(body.file);
      
      msg.delete();
      message.channel.send(cEmbed);
    }else if(cmd === '?cat' && message.member.roles.has(Discount.id) && personCoin >= (reg * discounted)){
      
      let msg = await message.channel.send("Summoning...")
      
                                                         coins[message.author.id] = {
          coins: coins[message.author.id].coins -= (reg * discounted)
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
            let {body} = await superagent
      .get("http://aws.random.cat/meow")
      if(!{body}) return message.channel.send("Welp, I lost it")
      let cEmbed = new Discord.RichEmbed()
      .setImage(body.file);
      
      msg.delete();
      message.channel.send(cEmbed);
      
    }else if(cmd === '?cat' && personCoin < reg){
      message.channel.send("Sorry, you don't have enough coins!");
    }
  
  //end of cat command
  
  //giving coins
  
  if(!coins[message.author.id]){
    coins[message.author.id] = {
      coins : 0
    };
  }
  

  
  let coinAmount = Math.floor(Math.random() * 15) + 1;
    if(message.member.roles.has(Double.id)){
    coinAmount = coinAmount * 2;
  }
  
  if(coinAmount > 0){
    coins[message.author.id]  = {
      coins: coins[message.author.id].coins += coinAmount
    };
    fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
    let coinEmbed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .addField(`${coinAmount} coins added!`);
    
   // message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
  }
  
  console.log(coins);
  
  if(cmd === '?coins'){
    let cEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor('#fff600')
    .addField('Number of Coins', coins[message.author.id].coins, true);
    
    message.channel.send(cEmbed);
  }
  
  //start of buy command
  
  if(cmd === '?buy'){
    if(question === 'Discount'){
      if(coins[message.author.id].coins >= mediumRole){
        coins[message.author.id] = {
          coins: coins[message.author.id].coins -= mediumRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
      } else if (question === 'Discount' && personCoin < mediumRole){
        message.channel.send("You don't have enough coins!");
      }
    }else if(question == "Double" && personCoin >= amazingRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= amazingRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "Movie" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "Book" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "Sports" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "App" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "Tech" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "Travel" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "Goal" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "Music" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == "Fashion" && personCoin >= cheapRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= cheapRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == 'Free' && personCoin >= expensiveRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= expensiveRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else if(question == 'Pair' && personCoin >= expensiveRole){
              coins[message.author.id] = {
          coins: coins[message.author.id].coins -= expensiveRole
        };
            fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
      if(err) {
        console.log(err);
      }
    });
        let grole = message.guild.roles.find(`name`, question);
        
        message.guild.member(message.author.id).addRole(grole);
        message.channel.send("Role Added!");
    }else{
        message.channel.send("You either don't have enough coins or you didn't give a valid role!");
     }
  }
const express = require('express');
const keepalive = require('express-glitch-keepalive');
 
const app = express();
 
app.use(keepalive);
 
app.get('/', (req, res) => {
  res.json('Ok');
});
});
