// DATA
let defaultRate = 1.2; // Hızı varsayılan 1.5 katına çıkarır

let usernames = new Map();
let connection = new TikTokIOConnection(undefined);
let finishGame = false;
let iconList = [];
let nextId = 1;
let winner = [];
let animationID;
let giftmsg = "Jetonun bol olsun!"; // Hediye için teşekkürler!
let followmsg = "Tak!p üçün təşəkkür"; // Takip ettiğin için teşekkürler
let membermsg = "Xoş gəldin"; // Hoş geldiniz
let sharemsg = "Paylaşım üçün təşəkkür"; // Paylaştığın için teşekkürler
let likemsg = "Bəyəndiyin üçün təşəkkür"; // Beğendiğin için teşekkürler
let messagesQueue = [];
// START
$(document).ready(() => {

    setTimeout(function () {
        let targetLive = "@freecoinapp";
        connect(targetLive);
    }, 5000);
})

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

connection.on('like', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
        like(userName, profilePictureUrl)
});

function like(username, imageUrl) {
    var container = document.getElementById("containerlike");
    container.classList.remove("fadeIn");
    container.classList.remove("fadeOut");

    document.getElementById("username").innerHTML = username;
    document.getElementById("message").innerHTML = likemsg;
    document.getElementById("image").src = imageUrl;

    container.classList.add("fadeIn");

    setTimeout(function () {
        container.classList.add("fadeOut");
    }, 5000);
}


connection.on('gift', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
//     if (data.giftId === 5269) {
//         playSound(1)
//     }
//     if (data.giftId === 5655) {
//         playSound(2)
//     }
//     if (data.giftId === 7591) {
//         playSound(3)
//     }
//     if (data.giftId === 6104) {
//         playSound(4)
//     }
//     if (data.giftId === 5509) {
//         playSound(5)
//     }
        gift(userName, profilePictureUrl)
});


function gift(username, imageUrl) {
    var container = document.getElementById("container");
    container.classList.remove("fadeIn");
    container.classList.remove("fadeOut");

    document.getElementById("username").innerHTML = username;
    document.getElementById("message").innerHTML = giftmsg;
    document.getElementById("image").src = imageUrl;

    container.classList.add("fadeIn");

    setTimeout(function () {
        container.classList.add("fadeOut");
    }, 5000);
}


connection.on('social', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    if (data.displayType === "pm_main_follow_message_viewer_2")
    {
        follow(userName, profilePictureUrl)
    }
    if (data.displayType === "pm_mt_guidance_share")
    {
        share(userName, profilePictureUrl)
    }
});


function follow(username, imageUrl) {
    var container = document.getElementById("containerfollow");
    container.classList.remove("fadeIn");
    container.classList.remove("fadeOut");

    document.getElementById("username").innerHTML = username;
    document.getElementById("message").innerHTML = followmsg;
    document.getElementById("image").src = imageUrl;

    container.classList.add("fadeIn");

    setTimeout(function () {
        container.classList.add("fadeOut");
    }, 5000);
}

function share(username, imageUrl) {
    var container = document.getElementById("containershare");
    container.classList.remove("fadeIn");
    container.classList.remove("fadeOut");

    document.getElementById("username").innerHTML = username;
    document.getElementById("message").innerHTML = sharemsg;
    document.getElementById("image").src = imageUrl;

    container.classList.add("fadeIn");

    setTimeout(function () {
        container.classList.add("fadeOut");
    }, 5000);
}

function playSound(mode) {
    document.getElementById("sfx"+mode).play();
  }


connection.on('member', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;


    member(userName, profilePictureUrl)
});




function member(username, imageUrl) {
    var container = document.getElementById("containermember");
    container.classList.remove("fadeIn");
    container.classList.remove("fadeOut");

    document.getElementById("username").innerHTML = username;
    document.getElementById("message").innerHTML = membermsg;
    document.getElementById("image").src = imageUrl;

    container.classList.add("fadeIn");

    setTimeout(function () {
        container.classList.add("fadeOut");
    }, 5000);
}



function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}
// End
connection.on('streamEnd', () => {
    $('#stateText').text('Canlı sona çatdı.');
})
