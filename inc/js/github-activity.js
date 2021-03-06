function githubActivity() {

    var username = "lachlanhardy";
    var url = "";

 $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20atom%20where%20url%3D%22http%3A%2F%2Fgithub.com%2F" + username + ".atom%22&format=json&callback=?",
    function(feed){
      
      var item = feed.query.results.entry; 
      $(item).each(function(i){
        var v = item[i].id;
        var idValue = v.match(/([^\/]*):([^\/]*)\/([^\/]*)$/);
        var eventType = idValue[2];
        
        // only for CommitEvents right now - need to bust out other events as options
        switch(eventType) {
          case 'CommitEvent':
            if (url == "") {
              url = item[i].link.href;
              titleText = " committed to ";
              return url;
              return titleText;
            }
            break;
          case 'FollowEvent':
            //
            break;
          case 'GistEvent':
            //
            break;
          case 'WikiEvent':
            //
            break;
        }
      });
      
      // grabbing details from URL
      var v = url.match(/http:\/\/github.com\/([^\/]*)\/([^\/]*)\/commit\/([^\/]*)$/);
      var user = v[1];
      var repo = v[2];
      var id = v[3];
      var repoName = user + "/" + repo;
      
      $.getJSON("http://github.com/api/v1/json/" + repoName + "/commit/" + id + "?callback=?",
        function(data){
          
          // creating initial elements
          var dl = $(document.createElement("dl"));
          var dt = $(document.createElement("dt"));
          var dtStrong = $(document.createElement("strong"));
        
          // linking username with REL microformat
          var dtUser = $(document.createElement("a"));
          dtUser.attr("href", "http://github.com/" + username).attr("rel", "me").text(username);
          
          // Adding username and eventText to dtStrong
          dtStrong.append(dtUser).append(titleText);
          
          // Linking repo name
          var repoAnchor = $(document.createElement("a"));
          repoAnchor.attr("href", "http://github.com/" + repoName).text(repoName);
          dtStrong.append(repoAnchor);
          
          // Building date for prettifying
          var dateSpan = $(document.createElement("span"));
          var dateTime = parseDate(data.commit.committed_date); // converts date to format Pretty Date recognises
          dateSpan.addClass("date").text(dateTime).attr("title", dateTime);
          dateSpan.prettyDate();
          setInterval(function(){ dateSpan.prettyDate(); }, 5000);
          
          // add dtStrong and dateSpan to DT
          dt.append(dtStrong).append(dateSpan);
          
          // Linking message to commit
          var ddMessage = $(document.createElement("dd"));
          messageAnchor = $(document.createElement("a"));
          messageAnchor.attr("href", url).text(data.commit.message);
          ddMessage.append(messageAnchor);
          
          // Listing all changed files
          var ddFilenames = $(document.createElement("dd"));
          ddFilenames.addClass("filenames");
          var filenamesUl = $(document.createElement("ul"));
          $(data.commit.modified).each(function(i){
            filenamesUl.append($(document.createElement("li")).text(data.commit.modified[i].filename));
          });
          ddFilenames.append(filenamesUl);
          
          // Adding content to DL
          dl.append(dt).append(ddMessage).append(ddFilenames);
          
          // Replacing static HTML with new hottness
          $("#github p").replaceWith(dl);
          
        } 
      );
    }
  );
}

function parseDate(dateTime) {
  var timeZone = 10; // or "-3" as appropriate
  
  // TODO: need to add date changing functionality too
  dateTime = dateTime.substring(0,19) + "Z";
  var theirTime = dateTime.substring(11,13);
  var ourTime = parseInt(theirTime) + 7 + timeZone;
  if (ourTime > 24) {
    ourTime = ourTime - 24;
  };
  dateTime = dateTime.replace("T" + theirTime, "T" + ourTime);
  return dateTime;
};
