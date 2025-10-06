var posts=["/post/42496.html","/post/62072.html","/post/45382.html","/post/26312.html","/post/21570.html","/post/61849.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };