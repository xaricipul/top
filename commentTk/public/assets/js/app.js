// DATA


let connection = new TikTokIOConnection(undefined);
let userGiftTotal = 0;
let user2GiftTotal = 0;
let userData = [];
let userDataLike = [];
let userDataShare = [];
let user2Data = [];
let userComment = [];
let lastGifter = null
let lastGifterPic = null
let lastGifterCount = null
let lastLiker = null
let lastLikerPic = null
let lastLikerCount = null
// START
$(document).ready(() => {
    // Resize
    function resizeContainer() {
        let height = window.innerHeight;
        let width = Math.round((11 / 16) * height);
        $("#gameSize").html(width + 'x' + height);
        $(".container").outerWidth(width);
        $(".background").outerWidth(width);
        $(".printer").outerWidth(width);
        $(".animation").outerWidth(width);

        // Paper
        if (window.innerWidth >= 960) {
            var paperHeight = $("#paperContainer").outerHeight() - 20;
        } else {
            var paperHeight = $("#paperContainer").outerHeight() + 7;
        }
        $("#paper").outerHeight(paperHeight);
    }
    resizeContainer();
    $(window).resize(function () {
        resizeContainer();
    });

    // Connect
    $("#targetConnect").click(function (e) {
        // Check
        let targetLive = $("#targetUsername").val();
        connect(targetLive);

    });

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



// Example of how to use the function


function addGift(data) {
    // DATA
    let userName = data.uniqueId;
    let giftPictureUrl = data.giftPictureUrl;
    let giftName = data.giftName;
    let id = data.giftId;
    let giftRepeat = data.repeatCount;
    lastGifterCount = (data.diamondCount * data.repeatCount);
    lastGifter = userName;
    lastGifterCount = giftRepeat;
    lastGifterPic = giftPictureUrl;
    profilePictureUrl = data.profilePictureUrl;
    document.getElementById("lastGifter").innerHTML = `<span  style="display: flex; align-items: center;color:black;font-size: 35pt; font-weight:bold;padding-top: 0px;"></span>
    <p style="font-size: 30pt !important;">  &nbsp; </p>  <img id="userListPhoto" src="${profilePictureUrl}"
                style="height: 125px; width: 125px; border-radius: 25px; margin-right: 5px;margin-bottom: 5px;"> ${userName} - ${lastGifterCount}  <img id="userListPhoto" src="${giftPictureUrl}"
                style="height: 45px; width: 45px; border-radius: 30px; margin-right: 5px;margin-bottom: 5px;" </span><span>göndərdi</span>`

    let userGift = null;
    userGift = (data.diamondCount * data.repeatCount);
    userGiftTotal += userGift;
    let userExists = false;
    for (let i = 0; i < userData.length; i++) {
        if (userData[i].username === userName) {
            userData[i].count = userData[i].count + userGift;
            userExists = true;
            break;
        }
    }
    if (!userExists) {
        userData.push({ username: userName, count: userGift, pp: profilePictureUrl });
    }
    let userList = document.getElementById("userList");
    userList.innerHTML = null;
    const top10 = userData
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(user => ({ username: user.username, count: user.count, pp: user.pp }));
    userList.innerHTML = null;

    top10.forEach((user, index) => {
        userList.innerHTML += `<li  <span style="display: flex; align-items: center;color:black;font-size: 40pt;padding-top: 0px;">${index + 1} - &nbsp;</span> 
        <img id="userListPhoto" src="${user.pp}"
            style="height: 100px; width: 100px; border-radius: 25px; margin-right: 10px;margin-bottom: 5px;">${user.username} - ${user.count} xal</li>`
    });
}

connection.on('chat', (data) => {

    let userName = data.uniqueId;
    let giftPictureUrl = data.giftPictureUrl;
    let giftName = data.giftName;
    let id = data.giftId;

    profilePictureUrl = data.profilePictureUrl;
    let text = data.comment.trim().toUpperCase();

    let words = ["TEKER", "TƏKƏR", "BIR","BİR", "İKİ","IKI","IKİ","İKI", "UC", "ÜÇ", "ÜC", "UÇ", "DÖRD", "DORD", "BEŞ", "BES", "1", "2", "3", "4", "5"];
    let lines = text.split(".");
    for (let line of lines) {
        for (let word of words) {
            if (line.includes(word)) {
                let userCommentExists = false;
                for (let i = 0; i < userComment.length; i++) {
                    if (userComment[i].username === userName) {
                        userComment[i].count = userComment[i].count + 1;
                        userCommentExists = true;
                        break;
                    }
                }
                if (!userCommentExists) {
                    userComment.push({ username: userName, count: 1, pp: profilePictureUrl });
                }
                let userListComment = document.getElementById("userComment");
                userListComment.innerHTML = null;
                const top10 = userComment
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map(user => ({ username: user.username, count: user.count, pp: user.pp }));
                userListComment.innerHTML = null;

                top10.forEach((user, index) => {
                    userListComment.innerHTML += `<li  <span style="display: flex; align-items: center;color:black;font-size: 40pt;padding-top: 0px;">${index + 1} - &nbsp;</span> 
                <img id="userListPhoto" src="${user.pp}"
                    style="height: 100px; width: 100px; border-radius: 25px; margin-right: 10px;margin-bottom: 5px;">${user.username} - ${user.count} xal</li>`
                });
                break;
            }
        }
    }
})

// function addMessage(data, msg) {
//     // DATA
//     let userName = data.uniqueId;
//     let message = sanitize(msg);

//     // Check for voice
//     let command = message.split(" ")[0];
//     if (command == "/say" || command == "/ngomong") {
//         // TTS
//         let cleanText = message.replace("/say", "").replace("/ngomong", "");
//         speakTTS(cleanText);

//     } else {
//         // Check setting
//         if (confComment && lock) {
//             // Add
//             addContent("<span style='font-weight: bold;'>" + userName + "</span>: " + message);

//             // Sound
//             playSound(1);
//         }

//     }
// }

connection.on('like', (data) => {

    let userName = data.uniqueId;
    let likeCount = data.likeCount;
    let profilePictureUrl = data.profilePictureUrl;
    let userLikeExists = false;
    lastLikerCount = likeCount;
    lastGifter = userName;
    profilePictureUrl = data.profilePictureUrl;
    document.getElementById("lastLiker").innerHTML = `<span  style="display: flex; align-items: center;color:black;font-size: 45pt;font-weight:bold;padding-top: 0px;"></span>
    <p style="font-size: 30pt !important;"> &nbsp;</p><img id="userListPhoto" src="${profilePictureUrl}"
                style="height: 90px; width: 90px; border-radius: 25px; margin-right: 5px;margin-bottom: 5px;"> ${userName}</span>`

    // for (let i = 0; i < userDataLike.length; i++) {
    //     if (userDataLike[i].username === userName) {
    //         userDataLike[i].count = userDataLike[i].count + likeCount;
    //         userExists = true;
    //         break;
    //     }
    // }
    // if (!userLikeExists) {
    //     userDataLike.push({ username: userName, count: likeCount, pp: profilePictureUrl });
    // }
    // var top1Liker = document.getElementById("topLiker");
    // top1Liker.innerHTML = null;
    // const topLikeUser = userDataLike
    //     .sort((a, b) => b.count - a.count)
    //     .slice(0, 2)
    //     .map(user => ({ username: user.username, count: user.count, pp: user.pp }));
    // topLikeUser.forEach((user, index) => {

    //     top1Liker.innerHTML += `<li  style="display: flex; align-items: center;color:black;font-size: 35pt;padding-top: 0px;"></span>
    //     <img id="userListPhoto" src="${user.pp}"
    //         style="height: 130px; width: 130px; font-weight:bold;border-radius: 25px; margin-right: 10px;margin-bottom: 5px;">${user.username} - ${user.count} bəyənmə</li>`
    // });



})


// Share, Follow
connection.on('social', (data) => {
    console.log('n')

    let userName = data.uniqueId;

    let profilePictureUrl = data.profilePictureUrl;
    let userShareExists = false;
    profilePictureUrl = data.profilePictureUrl;
    let likeCount = 1;



    for (let i = 0; i < userDataShare.length; i++) {
        if (userDataShare[i].username === userName) {
            userDataShare[i].count = userDataShare[i].count + likeCount;
            userShareExists = true;
            break;
        }
    }
    if (!userShareExists) {
        userDataShare.push({ username: userName, count: likeCount, pp: profilePictureUrl });
    }
    var top1Share = document.getElementById("topShare");
    top1Share.innerHTML = null;
    const topLikeShare = userDataShare
        .sort((a, b) => b.count - a.count)
        .slice(0, 2)
        .map(user => ({ username: user.username, count: user.count, pp: user.pp }));
    topLikeShare.forEach((user, index) => {
        console.log('a')
        top1Share.innerHTML += `<li  style="display: flex; align-items: center;color:black;font-size: 35pt;padding-top: 0px;"></span>
        <img id="userListPhoto" src="${user.pp}"
            style="height: 130px; width: 130px; font-weight:bold;border-radius: 25px; margin-right: 10px;margin-bottom: 5px;">${user.username} - ${user.count} bəyənmə</li>`
    });


})


// New gift received
connection.on('gift', (data) => {
    if (!isPendingStreak(data) && data.diamondCount > 0) {
        addGift(data);
    }
})


function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

// End
connection.on('streamEnd', () => {
    $('#stateText').text('Canlı sona çatdı.');
})
