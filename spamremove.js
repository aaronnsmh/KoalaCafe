var rbx = require('0q0-roblox'); // roblox-js works fine
var request = require('request');
var headers = {
  "Content-Type": "application/json"
}
var username = 'test';
var password = 'test';

var groupId = 'test';

var keywords = [
  "thousands of robux",
  "is giving access to",
  "giving access",
  "all game passes",
  "this is an official event",
  "official event",
  "no info needed","to the following link",
  "👉: rewardtool.se",
  "rewardtool.se",
  "rewardtool"
];

rbx.login(username, password).then(function() {
  console.log("LoggedIn");
  rbx.getWall({group: groupId}).then(function(data){
    var posts = data.posts
    for(var i = 0; i < data.posts.length; i++) {
      var found = 0;
      var message = data.posts[i]
      for (let phase of keywords) {
        if (message.content.toLowerCase().search(phase) != -1) found +=5;
      }
      if (/\S+\.\S+/.exec(message.content)) {
      //  found += 5;
      }
      if (found >= 5) {
          console.log("Removing Scam post from " + message.author.name );
          rbx.deleteWallPost({id:message.id, group:groupId}).catch(function(e) { });
        //  rbx.exile({group: groupId, target: message.author, deleteAllPosts: true});
      }
    }
  }).catch(function(e) { console.log(e); });

  var onWallPost = rbx.onWallPost({group: groupId});
  onWallPost.on("data", function(data) {
    var found = 0;
    for (let phase of keywords) {
      if (data.content.toLowerCase().search(phase) != -1) found+=5;
    }
    if (/\S+\.\S+/.exec(data.content)) {
    //  found += 5;
    }
    if (found >= 5) {
      var options = {
  url: "https://discordapp.com/api/webhooks/483736134250266624/yA2Q41Jc7E5p7O-7X_3Vvcw-JH8A47I_mvMYH7_1cEK07BBWPcJ2xuHh3B-AMvEIp9RS",
  method:  "POST",
  headers: headers,
  form: {"content": "Removed Post: **" + data.content + "** Username and ID: **" + data.author.name + " " + data.author.id + "**",
         "username": "Spam / Scam Removal",
         "avatar_url": "https://t2.rbxcdn.com/3f4941b2c0ac3eaa81991e2d11a35083"}
}
      request(options)
        console.log(data);
      rbx.deleteWallPost({id:data.id, group:groupId}).catch(function(e) { });
    }
  });
  onWallPost.on("close", function(e) { console.log("The event has disconnected!"); });
  onWallPost.on("error", function(e) {});
}).catch(function(e) {});
