var db = firebase.firestore();

function signUp(){
    var firstName=document.querySelector('.firstname').value;
    var lastName=document.querySelector('.lastname').value;
    var email=document.querySelector('.email').value;
    var pass=document.querySelector('.pass').value;
    emptyErrorFields();
        return new Promise((resolve,reject)=>{
       firebase.auth().createUserWithEmailAndPassword(email,pass)
       .then((res)=>{
          resolve(res);
    }).catch((error)=>{
     // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    reject(errorMessage);
  // ...
})
   })
}

async function signUpInner(){
    var firstName=document.querySelector('.firstname').value;
    var lastName=document.querySelector('.lastname').value;
    var email=document.querySelector('.email').value;
    var pass=document.querySelector('.pass').value;
    await signUp().then((res)=>{
            console.log(res);
    db.collection('users').doc(res.user.uid).set({fullname:firstName+' '+lastName,email});
    var firebaseRes=document.querySelector('.firebase-res');
    if(firebaseRes.innerHTML===''){
        window.open('signin.html')
    }
})
   .catch((errorMessage)=>{
       console.log(errorMessage);
       console.log(20)
    var firebaseRes=document.querySelector('.firebase-res');
    firebaseRes.innerHTML=errorMessage;
    firebaseRes.style.color='red'
     if(firebaseRes.innerHTML===''){
    window.open('signin.html')
}
})
}

function emptyErrorFields()
{
    var firebaseRes=document.querySelector('.firebase-res');
      firebaseRes.innerHTML='';
}

function checkUserSignIn(){
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //     //already signin user
    //     alert("you already signin \nfirst signout please \nthen login another account");
    //          userUidSaveInDb();
    //     }
    //     else {
          // No user is signed in.
//         userUidSaveInDb();
           location.href="templates/signin.html";
        }
//      });
// }
function  checkUserSignInTemplates(){
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //     //already signin user
    //    alert("you already signin \nfirst signout please \nthen login another account");
    //    userUidSaveInDb();
    //     }
    //     else {
    //       // No user is signed in.
    //      userUidSaveInDb();
           location.href="signin.html";
        }
    // });
//}
// function userUidSaveInDb(){
//     var currentUserUidCheck=localStorage.getItem("currentUserUidCheck");
//     if(currentUserUidCheck!==""){
//         var accountHead=document.getElementById('account-h4');
//         accountHead.setAttribute("onclick","");
//         accountHead.setAttribute("style","");
//     }

// }

function signIn(){
    var email=document.querySelector('.email').value;
    var pass=document.querySelector('.pass').value;
    var firebaseRes=document.querySelector('.firebase-res');
    emptyErrorFields();

    firebase.auth().signInWithEmailAndPassword(email,pass)
    .then((res)=>{
        //console.log(res);
      window.open('../index.html');
      localStorage.setItem("currentUserUidCheck",firebase.auth().currentUser.uid);

    }).catch((error)=>{
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        firebaseRes.innerHTML=errorMessage;
        firebaseRes.style.color='red'
    // ...
    })
}

function signout(){
    firebase.auth().signOut()
    .then((res)=>{
        alert('signout successfully');
        localStorage.setItem("currentUserUidCheck","");
        location.reload();
}).catch(function(error) {
        alert('no login user!!');
        console.log(error.message);
      });
}

function chatPermission(){
    var currentUserUidCheck=localStorage.getItem("currentUserUidCheck");
    const messaging = firebase.messaging();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //already signin user
        var uidMan=localStorage.getItem("uidMan");
        if(currentUserUidCheck!==uidMan){
            console.log(uidMan);
          console.log(currentUserUidCheck);
            messaging.requestPermission()
            .then(function() {
                console.log('Notification permission granted.');
                if(isTokenSentToServer()){
                    console.log("token already sent");
                }
                else{
                    //getRegToken();
                    getRegToken();
                }
            }).catch(function(err) {
                console.log('Unable to get permission to notify.', err);
            });
            localStorage.setItem("uidMan",currentUserUidCheck);
            console.log(uidMan);
         }
}
else {
    // No user is signed in.
    localStorage.setItem("uidMan","");
  console.log("login please!!");
}
});
}

function getRegToken(){
    const messaging = firebase.messaging();
    // Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
     messaging.getToken()
     .then(function(currentToken) {
      if(currentToken) {
      console.log('currentToken',currentToken);
      setTokenSentToServer(true);
      db.collection('users').doc(firebase.auth().currentUser.uid).get()
      .then((doc)=>{
        //console.log(firebase.auth().currentUser.uid)
        db.collection('tokens').add({'token':currentToken,'name':doc.data().fullname,email:doc.data().email});
      }).catch(error=>{
          console.log("galat syntax he bhai!!!!");
      })
    } else {
      console.log('No Instance ID token available. Request permission to generate one.');
      setTokenSentToServer(false);
    }
  }).catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    setTokenSentToServer(false);
  });
}
function setTokenSentToServer(sent){
    window.localStorage.setItem('sentToServer',sent ? 1:0);
}
function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}

function gotoCategoryPage(){
     window.open('templates/insertCate.html');
 }

function checkLoginUser(){
     var currentUserUidCheck=localStorage.getItem("currentUserUidCheck");
     if(currentUserUidCheck!==""){
    alert("already signin user!!");
    }
     else{
        location.href="signin.html";
     }
}

function addCategoryInToDb(){
    var name=document.querySelector('.name').value;
    var categories=document.querySelector('.categories').value;
    var longDescription=document.querySelector('.longDescription').value;
    var price=document.querySelector('.price').value;
    var model=document.querySelector('.model').value;
    var year=document.querySelector('.year').value;

    var labelName=document.querySelector('.labelName');
    var labelCategories=document.querySelector('.labelCategories');
    var labelLongDescription=document.querySelector('.labelLongDescription');
    var labelYear=document.querySelector('.labelYear');
    var labelModel=document.querySelector('.labelModel');
    var labelPrice=document.querySelector('.labelPrice');
    var errorLogin=document.querySelector('.errorLogin');
    if(name==''){
     labelName.style.color='red';
    }
    if( categories==''){
        labelCategories.style.color='red';
    }
    if(longDescription==''){
        labelLongDescription.style.color='red';
       }
       if(price==''){
        labelPrice.style.color='red';
       }
    if(model==''){
     labelModel.style.color='red';
    }
    if(year==''){
     labelYear.style.color='red';
    }
    var storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('images/ads_'+ Math.random().toString().substring(2, 6) +'.jpg');
    var file = document.querySelector('.imageId').files[0] // use the Blob or File API
                  return new Promise((resolve, reject) => {
           imagesRef.put(file)
            .then(function(snapshot) {
            //console.log('Uploaded a blob or file!', snapshot);
            imagesRef.getDownloadURL()
            .then(function(url) {
                resolve(url);
                 //console.log('URL *****', url)
              }).catch(function(error) {
                // Handle any errors
              });
        }).catch((error) => {
            console.log('bhai kuch masla hai', error.message)
            errorLogin.innerHTML='bhai pehle login ker -_- <br>phir ad submit ker!';
            errorLogin.style.color='red';

        });
    })
}

function addCategory(){
    var name=document.querySelector('.name').value;
    var categories=document.querySelector('.categories').value;
    var longDescription=document.querySelector('.longDescription').value;
    var price=document.querySelector('.price').value;
    var model=document.querySelector('.model').value;
    var year=document.querySelector('.year').value;

         addCategoryInToDb().then((url) => {
         console.log('addService image url', url)
         db.collection('tokens').where("email","==",firebase.auth().currentUser.email)
         .onSnapshot(querySnapshot=>{
            querySnapshot.forEach(doc=>{
        db.collection('adsUsers').add({name, categories,longDescription,price,model,year,url,
            uid:firebase.auth().currentUser.uid,email:firebase.auth().currentUser.email,adId:Math.random().toString().substring(2, 10),token:doc.data().token})
        .then((res)=>{
          alert('submit an app successfully')
          console.log(res);
          console.log(res.id);
      })
      .catch((error)=>{
       alert(error.message);
      })
    })
})
})
    // setInterval(function(){
    //     location.reload();

    // },5000);
}


// TODO add service worker code here
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
}
///////////////////////////////////////////////////

////////////////////////////////////////////////////

function searchCategory(){
  var olxBodyDomImage=document.querySelector('.olx-container-body-dom-image');
    var searchValue=document.querySelector('.olx-container-header-search').value;
  //console.log('search =>',searchValue);
    var body =document.querySelector(".olx-container-body");
    //console.log(olxBodyDomImage.childNodes.length);
    // if(olxBodyDomImage.childNodes.length>=0){

    //     olxBodyDomImage.parentNode.removeChild(olxBodyDomImage);
    // }

    db.collection('adsUsers').where('categories','==',searchValue)
    .onSnapshot((querySnapshot)=>{
        var figList=[];
        var cities = [];
        querySnapshot.forEach((doc)=>{
            var img=document.createElement('img');
            var div=document.createElement('div');
            var figure=document.createElement('figure');
            var figcaption=document.createElement('figcaption');
            figcaption.setAttribute('name',doc.data().name)
            cities.push(doc.data().name);
            console.log(doc.data().categories)

            figcaption.innerHTML='NAME :'+' '+doc.data().name.toUpperCase()+"<br>"+'PRICE :'+' '+doc.data().price.toUpperCase();
            figcaption.style.textAlign='center';
            figcaption.style.cursor="pointer"
            figcaption.style.background="#f8f8f8";
            figcaption.style.display="table-caption";
            figcaption.style.captionSide="bottom";
            figcaption.setAttribute("onmouseover","this.style.color='red'");
            figcaption.setAttribute("onmouseout","this.style.color='black'");

            img.src=doc.data().url;
            img.style.height="20vh";
            img.style.width="18vw";
            img.style.cursor="pointer";
            img.style.display="block";
            img.id="db-image";
            img.style.margin="0";
            img.style.padding="0";

            figure.style.margin="3px";
            figure.style.padding="0px";
            figure.style.marginBottom="12px"
            figure.style.display="table";
            figure.style.border="3px solid #f8f8f8"

            div.style.textAlign="center";
            cities.push(doc.data().name);
            div.style.alignItems="center";
            div.style.flex="1";
            div.style.margin="0";
            div.style.borderRadius="1em";
            div.style.padding="0";
            //div.id='db-div'

            figure.setAttribute('uid',doc.data().uid)
            figure.setAttribute('adId',doc.data().adId);
            figure.setAttribute('class',doc.data().adId);
            figure.setAttribute('onclick','userInfo(className)');
            figList.push(figure);
            figure.appendChild(img);
            figure.appendChild(figcaption);
            div.appendChild(figure);
            searchImageDiv.className='hide';
            olxBodyDomImage.appendChild(div);

            // var dbImage=document.getElementById('db-image');
            // if(searchValue===''){
                //     dbDiv.remove();
                //     searchImage.className='';
                // }
            })
            console.log(figList);
        console.log("name", cities.join(", "));
    })
        // db.collection("categories").where("shortDescription", "==", searchValue)
        //   .onSnapshot(function(querySnapshot) {
        //       var cities = [];
        //       querySnapshot.forEach(function(doc) {
        //           cities.push(doc.data().name);
        //           console.log(doc.data().mobile)
        //       });
        //       console.log("name", cities.join(", "));
        //   });
}


// function searchCategoryPage(){

// }
function globalCategory(name){
    window.open("templates/newPage.html");
    localStorage.setItem('categoryClick',name);
}

function loading(){
    var olxBodyDomImage=document.querySelector('.olx-container-body-dom-image');
    var body =document.querySelector(".olx-container-body");
    var category=localStorage.getItem('categoryClick');
    db.collection('adsUsers').where('categories','==',category.slice(0,length-1))
    .onSnapshot((querySnapshot)=>{
        var figList=[];
        var cities = [];
        querySnapshot.forEach((doc)=>{
            var img=document.createElement('img');
            var div=document.createElement('div');
            var figure=document.createElement('figure');
            var figcaption=document.createElement('figcaption');
            console.log(doc.data().categories)

            figcaption.innerHTML='NAME :'+' '+doc.data().name.toUpperCase()+"<br>"+'PRICE :'+' '+doc.data().price.toUpperCase();
            figcaption.style.textAlign='center';
            figcaption.style.cursor="pointer"
            figcaption.style.background="#f8f8f8";
            figcaption.style.display="table-caption";
            figcaption.style.captionSide="bottom";
            figcaption.setAttribute("onmouseover","this.style.color='red'");
            figcaption.setAttribute("onmouseout","this.style.color='black'");
            figcaption.id="figcap";

            img.src=doc.data().url;
            img.style.width="18vw";
            img.style.height="20vh";
            img.style.cursor="pointer";
            img.style.display="block";
            img.id="db-image";
            img.style.margin="0px";
            img.style.padding="0px";


            figure.style.margin="3px";
            figure.style.padding="0px";
            figure.style.marginBottom="12px"
            figure.style.display="table";
            figure.style.border="3px solid #f8f8f8"


            div.style.textAlign="center";
            cities.push(doc.data().name);
            div.style.alignItems="center";
            div.style.flex="1";
            div.style.margin="0";
            div.style.borderRadius="1em";
            div.style.padding="0";
            //div.id='db-div'
            
                figure.setAttribute('uid',doc.data().uid)
                figure.setAttribute('adId',doc.data().adId);
                figure.setAttribute('class',doc.data().adId);
                figure.setAttribute('onclick','userInfo(className)');
                //var figId=document.getElementById('figId');
                figList.push(figure);
                figure.appendChild(img);
                figure.appendChild(figcaption);
                div.appendChild(figure);
                searchImageDiv.className='hide';
                olxBodyDomImage.appendChild(div);

                // var dbImage=document.getElementById('db-image');
                // if(searchValue===''){
                    //     dbDiv.remove();
                    //     searchImage.className='';
                    // }

                })
                //var figId=document.getElementById('figId');
                console.log(figList);

                // figId.addEventListener('click',userInfo(className));
            console.log("name", cities.join(", "));
        })

}

    var loader=document.querySelector('.loader');
    var searchImageDiv=document.getElementById('search-image-div');
    var body =document.querySelector(".olx-container-body");
    var olxBodyDomImage=document.querySelector('.olx-container-body-dom-image');
    setTimeout(function(){
       loader.className='none';
     },2000);
     searchImageDiv.className='hide';
      setTimeout(function(){
         console.log(olxBodyDomImage.childNodes.length);
        if(olxBodyDomImage.childNodes.length==1){
            searchImageDiv.className='';
            var para=document.createElement('p');
            para.innerHTML='Ooops, No Data Found. write in search bar!!'
            searchImageDiv.appendChild(para) }
        },2000)

function userInfo(className){
    console.log(className);

    localStorage.setItem("adIdAttribute",className);
    window.open("../templates/userInfo.html")
}

function userAllInfo(){
     var checkUser=localStorage.getItem("adIdAttribute");

     var olxBody=document.querySelector('.olx-container-body');
     olxBody.textAlign="center";
     var div1=document.querySelector('.div1');
     var div3=document.querySelector('.div3');

     var div30=document.querySelector('.div30');
     var div4=document.querySelector('.div4');
     var div5=document.querySelector('.div5');
     var div6=document.querySelector('.div6');
     var div7=document.querySelector('.div7');
     db.collection('adsUsers').where("adId","==",checkUser)
     .onSnapshot((querySnapshot)=>{
       querySnapshot.forEach((doc)=>{


        var img=document.createElement('img');
        var p1=document.createElement('h3');
        var p2=document.createElement('h3');
        var p3=document.createElement('h3');
        var p4=document.createElement('h3');
        var p5=document.createElement('h3');
        var p6=document.createElement('h3');

        img.src=doc.data().url;
        img.setAttribute("adId",checkUser);
        img.id="userImage";
        img.style.width='40vw';
        img.style.height="40vh";
        div1.appendChild(img);

          p1.innerHTML="NAME:"+"  "+doc.data().name.toUpperCase();
          p2.innerHTML="CATEGORIES:"+"  "+doc.data().categories.toUpperCase();
          p3.innerHTML="LONG DESCRIPTION:"+"  "+doc.data().longDescription.toUpperCase();
          p4.innerHTML="MODEL:"+"  "+doc.data().model.toUpperCase();
          p5.innerHTML="YEAR:"+"  "+doc.data().year;
          p6.innerHTML="PRICE:"+"  "+doc.data().price;
          p1.style.fontSize="60px;"

          p2.style.fontSize="10px;"
          p3.style.fontSize="60px;"
          p6.style.fontSize="60px;"
          p4.style.fontSize="60px;"
          p5.style.fontSize="60px;"

         div3.appendChild(p1);
         div30.appendChild(p6);
         div4.appendChild(p2);
         div5.appendChild(p3);
         div6.appendChild(p4);
         div7.appendChild(p5);

         })
    })

}
function chatWithUser(){
    var chatTextArea=document.querySelector(".send-notification-text");
    var chatTextAreaButton=document.querySelector(".send-notification-button");
    var chatTextAreaError=document.querySelector(".send-notification-text-error");
    var div1=document.querySelector('.div1');
    if(chatTextArea.value ==""){
     chatTextAreaError.innerHTML="This is required field";
     chatTextAreaError.style.color="red";
     chatTextArea.style.borderColor="red";
     chatTextAreaButton.style.marginTop="-10px";
    }
   else{
    chatTextAreaError.innerHTML="";
    chatTextAreaError.style.color="";
    chatTextArea.style.borderColor="";

    if(div1.hasChildNodes()==true){
        var adIdImage=document.getElementById('userImage');
        var adIdNum=adIdImage.getAttribute("adId");
        console.log(adIdNum);
    }

    
    db.collection('adsUsers').where("adId","==",adIdNum)
    .onSnapshot((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
            db.collection('users').doc(doc.data().uid).get()
            .then(res=>{
                  console.log(res.data().email);
                      
            var user1=firebase.auth().currentUser.uid;
            var user2=doc.data().uid;
            var senderEmail=firebase.auth().currentUser.email;
            var receiverEmail=res.data().email;
            // console.log(user1);
            // console.log(user2);
                    db.collection('rooms').where("users","==",{[user1]:true,[user2]:true}).where("adId","==",adIdNum).get()
                    .then((querySnapshot)=>{
                        querySnapshot.forEach((doc)=>{
                            console.log(doc.id);
                           
                            var url =new URL(location.href);
                            var index=url.href.lastIndexOf("/");
                            var myUrl= url.href.substr(0,index);
                            myUrl=myUrl+"/usersChatRoom.html#"+doc.id;
                            location.href=myUrl;
                           var obj=Object.keys(doc.data().users);
                            if(user1===(obj[0]||obj[1]) && user2===(obj[1]||obj[0]) && adIdNum===(doc.data().adId) && (user1!==user2)){
                                db.collection('rooms').doc(doc.id).collection('messages').add({message:chatTextArea.value,senderId:senderEmail,receiverId:receiverEmail
                                    ,createdAt:Date()});
                                console.log("sucess");
                            }
                            else if(user1===(obj[0]||obj[1]) && user2===(obj[1]||obj[0]) && adIdNum!==(doc.data().adId) && (user1!==user2)){
                                throw("error");
                }
            })
                if(querySnapshot.empty==true ){
                 throw("error")
                 }

              else if(user1==user2){
                alert("both user is same, it is not allowed");
                      }
            }).catch((error)=>{
                if(user1!==user2){
                    db.collection('tokens').where("email","==",firebase.auth().currentUser.email).where("email","==",doc.data().email).get()
                    .then(querySnapshot=>{
                               throw(error)
                        querySnapshot.forEach(respond=>{
                            console.log("room did not exist");
                            console.log(respond.data().token)
                             db.collection('rooms').add({createdAt:Date(),users:{[user1]:true,[user2]:true},userEmails:{senderId:senderEmail,receiverId:receiverEmail},
                             adId:adIdNum,category:doc.data().categories,price:doc.data().price,tokens:{receiverToken:doc.data().token,senderToken:(respond.data().token)}})
                             .then(res=>{
                             console.log("roomId =>",res.id);
                             db.collection('rooms').doc(res.id).collection('messages').add({message:chatTextArea.value,senderId:senderEmail,receiverId:receiverEmail,createdAt:Date()});
                             var url =new URL (location.href);
                             var index=url.href.lastIndexOf("/");
                             var myUrl= url.href.substr(0,index);
                             myUrl=myUrl+"/usersChatRoom.html#"+res.id;
                             location.href=myUrl;          
                             })   
                            })  
                        }).catch(error=>{
                            if(user1!==user2){
                                console.log("room did not exist");
                                 db.collection('rooms').add({createdAt:Date(),users:{[user1]:true,[user2]:true},userEmails:{senderId:senderEmail,receiverId:receiverEmail},
                                 adId:adIdNum,category:doc.data().categories,price:doc.data().price,tokens:{receiverToken:doc.data().token,senderToken:(doc.data().token)}})
                                 .then(res=>{
                                 console.log("roomId =>",res.id);
                                 db.collection('rooms').doc(res.id).collection('messages').add({message:chatTextArea.value,senderId:senderEmail,receiverId:receiverEmail,createdAt:Date()});
                                 var url =new URL (location.href);
                                 var index=url.href.lastIndexOf("/");
                                 var myUrl= url.href.substr(0,index);
                                 myUrl=myUrl+"/usersChatRoom.html#"+res.id;
                                 location.href=myUrl;          
                                })   
                             }
                        })
                 }
                else if(user1===user2){
                alert("both user is same, it is not allowed");
                }
                
            })
        }) 
     })
    })  
}
}

function userSendText(){
const messaging = firebase.messaging();
var textField=document.querySelector('.text-field');
var textFieldComp=document.querySelector('.text-field').value;
var roomId=location.href;
var roomNum= roomId.substr(-20)
let currentUser= firebase.auth().currentUser.email;

 //console.log(roomNum);
if(!textFieldComp){
    textField.style.borderColor="red";
    return 0;
}
 db.collection('rooms').doc(roomNum).get()
 .then(doc=>{
      // console.log(doc.data().userEmails.receiverId);     
        // console.log(firebase.auth().currentUser.email)
       db.collection('users').doc(firebase.auth().currentUser.uid).get()
       .then(respond=>{
console.log(respond.data().fullname)
        let userIdChange=currentUser!==doc.data().userEmails.receiverId? doc.data().userEmails.receiverId : doc.data().userEmails.senderId;
        let userToken=currentUser!==doc.data().userEmails.receiverId? doc.data().tokens.receiverToken : doc.data().tokens.senderToken; 
        db.collection('rooms').doc(roomNum).collection('messages').add({message:textFieldComp,senderId:firebase.auth().currentUser.email,
           receiverId:userIdChange,createdAt:Date()})
           .then(res=>{      
            ;
                
                console.log("successfully add")
                textField.value=""; 
                ////////////////////////////////
                messaging.onMessage((payload) => {
                    console.log('payload-message', payload)
                });
                //Way to push notification using fetch!
                //Server Key (Firebase -> Project -> Settings -> Cloud Messaging -> Server Key
                var key = 'AIzaSyBtj4aTRPzGLvqlUlf1XQ-LAl7vvJFnFNg';
                 console.log(doc.data().tokens.receiverToken );
                var to =userToken;
                var notification = {
                'title': "OLX APP",
                'body': `${respond.data().fullname}:${textFieldComp}`,
                'icon': 'firebase-logo.png',
                'image': 'firebase-images.png',
                "click_action":roomId
                };
        
            fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                'headers': {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                  'notification': notification,
                    'data':{
                        "status":`${respond.fullname}:${textFieldComp}`,
                        "click_action":roomId
                    },
                    'to': to
                })
        
            }).then(function(response) {
               console.log(response);
            }).catch(function(error) {
                console.error(error);
                       })
})
})
            
db.collection('rooms').doc(roomNum).collection('messages').orderBy('createdAt', 'desc').limit(1)
.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change){
                console.log("new: ", change.doc.data().message);
                let chatTextBox=change.doc.data().senderId===doc.data().userEmails.senderId ? "left":"right"; 
                    var chatBody=document.querySelector('.chat-body');
                    var div=document.createElement('div');
                    var textnode=document.createTextNode(change.doc.data().message);
                    //div.id="divSenderChat";
                    div.setAttribute("class",chatTextBox); 
                    div.appendChild(textnode);
                    chatBody.appendChild(div);
            })

        })
    
})
}

function getMessages(){
    var roomId=location.href;
    var roomNum= roomId.substr(-20);
    var chatHeadBodyPara1=document.querySelector('.chat-head-body-para1');
     //console.log(roomNum);    
     db.collection('rooms').doc(roomNum).get()
     .then(doc=>{
            // console.log(doc.data().userEmails.receiverId);     
            // console.log(firebase.auth().currentUser.email)
        if((firebase.auth().currentUser.email)!==(doc.data().userEmails.receiverId)){
                chatHeadBodyPara1.innerHTML="From "+" ("+firebase.auth().currentUser.email+") "+"To"+" ("+doc.data().userEmails.receiverId+")"
                 +"<br>"+"adId No.: "+" ("+doc.data().adId+")" ;
        }
        else if((firebase.auth().currentUser.email)===(doc.data().userEmails.receiverId)){
            chatHeadBodyPara1.innerHTML="From "+" ("+firebase.auth().currentUser.email+") "+"To"+" ("+doc.data().userEmails.senderId+")"
             +"<br>"+"adId No.: "+" ("+doc.data().adId+")" ;
            }
    
//        var chatBody=document.querySelector('.chat-body');
//        var roomId=location.href;
//        var roomNum= roomId.substr(-20);
//        console.log(roomNum);
//        db.collection('rooms').doc(roomNum).collection('messages').orderBy("createdAt","asc").get()
//        .then(querySnapshot=>{
//            querySnapshot.forEach(res=>{ 
//         if((res.data().senderId)===(doc.data().userEmails.senderId )){
//                     var chatBody=document.querySelector('.chat-body');
//                     var div=document.createElement('div');
//                     var textnode=document.createTextNode(res.data().message);
//                     //div.id="divSenderChat";
//                     div.setAttribute("class","left"); 
//                     div.appendChild(textnode);
//                     chatBody.appendChild(div);
          
//         }
//         else if((res.data().receiverId)!==(doc.data().userEmails.receiverId)){ 
//                    var chatBody=document.querySelector('.chat-body');
//                     var div=document.createElement('div');
//                     var textnode=document.createTextNode(res.data().message);
//                     div.style.marginLeft="auto"
//                    // div.id="divSenderChat";
//                    div.setAttribute("class","right"); 
//                     div.appendChild(textnode);
//                     chatBody.appendChild(div);
//         }
//                      })
// })
})    
}
function showDataUsers(){
  var chatroomBody=document.querySelector(".chatroom-body");

     db.collection('rooms').where("users."+firebase.auth().currentUser.uid,"==",true).get()
    .then((res)=>{
    res.forEach(doc=>{
     console.log(doc.id);
     var div=document.createElement('div');
     div.innerHTML="adId:"+"  "+doc.data().adId+"<br>"+"category:"+"  "+doc.data().category+"<br>"+"price:"+"  "+doc.data().price+"<br>"+
     "receiverId:"+"  "+doc.data().userEmails.receiverId+"<br>"+"senderId:"+"  "+doc.data().userEmails.senderId; 
     div.id="divDataUser"
    var divDataUser=document.getElementById("divDataUser")
    div.style.padding="10px";
    div.style.fontSize="18px";
    div.style.paddingLeft="30px";
    div.style.width="50vw";
    div.style.margin="10px";
    div.style.background="#25d366";
    div.style.borderRadius="10px";
    div.style.cursor="pointer";
    div.setAttribute("class",doc.id);
    div.setAttribute("onclick","chatTabOpen(className)")
    chatroomBody.appendChild(div);
    
})
})
}


function chatTabOpen(className){
    var url =new URL (location.href);
    var index=url.href.lastIndexOf("/");
    var myUrl= url.href.substr(0,index);
    myUrl=myUrl+"/usersChatRoom.html#"+className;
    location.href=myUrl;    
}

