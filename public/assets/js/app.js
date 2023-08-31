// DATA
let defaultRate = 1.2; // Hızı varsayılan 1.5 katına çıkarır

let usernames = new Map();
let connection = new TikTokIOConnection(undefined);
let userdata = [];
let commentsDiv ;
let giftsDiv;



$(document).ready(() => {

    setTimeout(function () {
        let targetLive = "sovet05scp";
        connect(targetLive);
    }, 5000);
})


/*
* LIVE TIKTOK
*/

function connect(targetLive) {
    if (targetLive !== '') {
        $('#stateText').text('Qoşulur...');
        $("#usernameTarget").html("@" + targetLive);
        connection.connect(targetLive, {
            enableExtendedGiftInfo: true
        }).then(state => {
            $('#stateText').text(`Xoş gəldin... ${state.roomId}`);
        }).catch(errorMessage => {
            $('#stateText').text(errorMessage);
        })
    } else {
        alert('İstifadəçi adını daxil et');
    }
}

function createRandomUsername() {
    const randomId = Math.floor(Math.random() * 10000);
    return `user${randomId}`;
}

/* ... */

function getRandomPosition() {
    const x = Math.floor(Math.random() * (400 - 100));
    const y = Math.floor(Math.random() * (400 - 20));
    return { x, y };
}

/* ... */

window.onload = () => {
    commentsDiv = document.getElementById("comments");
    giftsDiv = document.getElementById("gifts");

};

function comment(username) {
    if (!userdata.includes(username)) {
        userdata.push(username);
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment";
        commentDiv.innerText = username;

        const position = getRandomPosition();
        commentDiv.style.left = `${position.x}px`;
        commentDiv.style.top = `${position.y}px`;

        commentsDiv.appendChild(commentDiv);

        setTimeout(() => {
            if (commentDiv.parentNode) {
                commentsDiv.removeChild(commentDiv);
            }
            const index = userdata.indexOf(username);
            userdata.splice(index, 1);
        }, 500);
    }
}
function gift(username) {
    const giftDiv = document.createElement("div");
    giftDiv.className = "gift";
    giftDiv.innerText = username;

    const position = getRandomPosition();
    giftDiv.style.left = `${position.x}px`;
    giftDiv.style.top = `${position.y}px`;

    giftsDiv.appendChild(giftDiv);

    setTimeout(() => {
        if (giftDiv.parentNode) {
            giftsDiv.removeChild(giftDiv);
        }
    }, 5000);
}


connection.on('chat', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    comment(userName);
});


connection.on('like', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    gift(userName);
});


connection.on('member', (data) => {
   
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
   

})

connection.on('social', (data) => {
   
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    let userlistExist = false;
  

function member(username, imageUrl) {
    var container = document.getElementById("containermember");
    container.classList.remove("fadeIn");
    container.classList.remove("fadeOut");

    document.getElementById("username").innerHTML = username;
    document.getElementById("message").innerHTML = membermsg;
    document.getElementById("image").src = imageUrl;


// // New gift received
connection.on('gift', (data) => {
   
    let userName = data.uniqueId;
    giftCount = (data.diamondCount * data.repeatCount);
    let profilePictureUrl = data.profilePictureUrl;
   

})


function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}
// End
connection.on('streamEnd', () => {
    $('#stateText').text('Canlı sona çatdı.');
})
