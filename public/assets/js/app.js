// DATA

let defaultRate = 1.2; // Hızı varsayılan 1.5 katına çıkarır

let usernames = new Map();

let connection = new TikTokIOConnection(undefined);
let userdata = [];
let commentsDiv;
let giftsDiv;

let messagesQueue = [];

$(document).ready(() => {

    // $("#targetConnect").click(function (e) {
    //     // Check
    //     let targetLive = $("#targetUsername").val();
    //     connect(targetLive);

    // });

    setTimeout(function () {
        let targetLive = "slotaze";
        connect(targetLive);
    }, 5000);
})

function onEnd() {
    messagesQueue.shift();
    processQueue();
}
function containsBannedWords(text) {
    const bannedWords = ["pox", "cindir", "amciq", "got", "meme", "məmə", "dillaq", "dıllağ", "göt", "amcıq", "Bok", "am", "kahbe", "Qəhbə", "Qancıx", "Götveren"];

    for (const word of bannedWords) {
        if (text.match(new RegExp('\\b' + word + '\\b', 'gi'))) {
            return true;
        }
    }

    return false;
}


function speak(text) {
    if (containsBannedWords(text)) {
        text = "söyüş söyme";
        let ms = [
            { text: text, language: "en" }]

    }
    responsiveVoice.speak(ms, "Turkish Male", { rate: defaultRate, onend: onEnd });
}


function processQueue() {
    if (messagesQueue.length > 0 && !responsiveVoice.isPlaying()) {
        let message = messagesQueue[0].text;
        let language = messagesQueue[0].language;

        // Dil tespiti

        // Dil tercihine göre seslendirme yapın
        switch (language) {
            case 'tr':
                // Türkçe seslendirme
                responsiveVoice.speak(message, "Turkish Male", { rate: defaultRate, onend: onEnd });
                break;
            case 'en':
                // İngilizce seslendirme
                responsiveVoice.speak(message, "UK English Male", { rate: defaultRate, onend: onEnd });
                break;

            default:
                // Dil tespit edilemediğinde varsayılan olarak İngilizce kullanın
                responsiveVoice.speak(message, "Turkish Male", { rate: defaultRate, onend: onEnd });
                break;
        }
    }
}

let lastMessageTime = 0;
function addRandomMessage(timestamp) {
    const messages = [
        { text: "Don't miss out, follow and like now", language: "en" },
        { text: "İlk üçe gir ve takip al", language: "tr" },
        { text: "Follow those who send likes and gifts", language: "en" },
        { text: "Join the top ranks and get followed", language: "en" },
        { text: "First to comment gets a follow", language: "en" },
        { text: "Hepinize Teşekkür ederim", language: "tr" },
        { text: "Top 3 gifters will get a follow back", language: "en" },
        { text: "Support each other with likes and follows", language: "en" },
        { text: "Beğeni ve hediye gönderenleri takip et", language: "tr" },
        { text: "Live Share", language: "en" },
        { text: "Canlını paylaş", language: "tr" },
        { text: "Show some love, like and follow", language: "en" },
        { text: "Sevginizi gösterin, beğen ve takip et", language: "tr" },
        { text: "Yorum yaz, karşılığında takip ederim", language: "tr" },
        { text: "Harikasınız", language: "tr" },
        { text: "Spread the love, follow and support", language: "en" },
        { text: "Sevgiyi yay, takip et ve destekle", language: "tr" },
        { text: "Let's grow together, like and follow", language: "en" },
        { text: "Birlikte büyüyelim, beğen ve takip et", language: "tr" },
        { text: "Join the community, follow and engage", language: "en" },
        { text: "Topluluğa katıl, takip et ve etkileşime gir", language: "tr" },
        { text: "Follow for daily content", language: "en" },
        { text: "Günlük içerik için takip et", language: "tr" },
        { text: "Like and comment for a follow back", language: "en" },
        { text: "Beğen ve yorum yap, karşılığında takip ederim", language: "tr" },
        { text: "Stay connected, follow and share", language: "en" },
        { text: "Bağlantıda kal, takip et ve paylaş", language: "tr" },
        { text: "Turn on notifications for updates", language: "en" },
        { text: "Güncellemeler için bildirimleri aç", language: "tr" },
        { text: "You're amazing, thank you", language: "en" },
        { text: "Müthişsiniz, teşekkürler", language: "tr" },
        { text: "Keep the positivity going, like and follow", language: "en" },
        { text: "Pozitif enerjiyi sürdür, beğen ve takip et", language: "tr" },
        { text: "Together we're stronger, support and follow", language: "en" },
        { text: "Birlikte daha güçlüyüz, destekle ve takip et", language: "tr" },
        { text: "Sharing is caring, follow and repost", language: "en" },
        { text: "Paylaşmak önemsemektir, takip et ve yeniden paylaş", language: "tr" },
        { text: "Stay tuned for more content", language: "en" },
        { text: "Daha fazla içerik için takipte kal", language: "tr" },
        { text: "Discover new friends, follow and interact", language: "en" },
        { text: "Yeni arkadaşlar keşfet, takip et ve etkileşime gir", language: "tr" },
        { text: "Let's inspire each other, like and follow", language: "en" },
        { text: "Birbirimize ilham verelim, beğen ve takip et", language: "tr" },
        { text: "Follow for exclusive content", language: "en" },
        { text: "Özel içerik için takip et", language: "tr" },
        { text: "Drop a like and get a follow", language: "en" },
        { text: "Beğeni bırak, takipçi kazan", language: "tr" },
        { text: "Keep up the great work, thank you", language: "en" },
        { text: "Harika işler çıkarmaya devam edin, teşekkürler", language: "tr" },
        { text: "Connect and grow, follow and support", language: "en" },
        { text: "Bağlan ve büyü, takip et ve destekle", language: "tr" },
        { text: "Follow for motivational content", language: "en" },
        { text: "Motivasyon içerikleri için takip et", language: "tr" },
        { text: "Join the conversation, comment and follow", language: "en" },
        { text: "Sohbete katıl, yorum yap ve takip et", language: "tr" },
        { text: "Explore new ideas, follow and share", language: "en" },
        { text: "Yeni fikirler keşfet, takip et ve paylaş", language: "tr" },
        { text: "Stay updated, follow and turn on notifications", language: "en" },
        { text: "Güncel kal, takip et ve bildirimleri aç", language: "tr" },
        { text: "Follow and share your thoughts", language: "en" },
        { text: "Takip et ve düşüncelerini paylaş", language: "tr" },
        { text: "Like and comment for mutual support", language: "en" },
        { text: "Karşılıklı destek için beğen ve yorum yap", language: "tr" },
        { text: "Build a positive community, follow and engage", language: "en" },
        { text: "Pozitif bir topluluk oluştur, takip et ve etkileşime gir", language: "tr" },
        { text: "We appreciate your support, thank you", language: "en" },
        { text: "Desteğiniz için teşekkür ederiz", language: "tr" },
        { text: "When you send a gift, your account will be displayed on the screen", language: "en" },
        { text: "Hediye gönderdiğinde hesabın ekranda görünecek", language: "tr" },
        { text: "When you write a message, your account will be displayed on the screen", language: "en" },
        { text: "Mesaj yazdığında hesabın ekranda görünecek", language: "tr" },
        { text: "When you like, your account will be displayed on the screen", language: "en" },
        { text: "Beğendiğinde hesabın ekranda görünecek", language: "tr" },
        { text: "When you share, your account will be displayed on the screen", language: "en" },
        { text: "Paylaştığında hesabın ekranda görünecek", language: "tr" }

    ];


    if (!lastMessageTime) {
        lastMessageTime = timestamp;
    }

    if (!lastMessageTime) {
        lastMessageTime = timestamp;
    }
   if (elapsed >= 10000) { // 10000ms = 10s
        // Rastgele mesajı ekle
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        messagesQueue.push(randomMessage);
        processQueue();

        // Zamanlayıcıyı sıfırla
        lastMessageTime = timestamp;
    }
    window.requestAnimationFrame(addRandomMessage);
}

// Otomatik seslendirme başlatma
// Otomatik seslendirme başlatma
window.addEventListener("load", async () => {
    try {
        // Kullanıcıdan otomatik seslendirmeye izin isteyin
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.resume();

        // requestAnimationFrame ile addRandomMessage fonksiyonunu çağırarak başlatın
        window.requestAnimationFrame(addRandomMessage);
    } catch (error) {
        console.error("Otomatik seslendirme başlatılamadı:", error);
    }
});

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

function getRandomPosition(maxWidth, maxHeight) {
    const x = Math.floor(Math.random() * (450 - maxWidth)); // 20px padding for the container border
    const y = Math.floor(Math.random() * (430 - maxHeight));
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

        // Temporarily add the div to the DOM to get the dimensions
        commentsDiv.appendChild(commentDiv);
        const commentSize = commentDiv.getBoundingClientRect();
        const position = getRandomPosition(commentSize.width, commentSize.height);
        commentDiv.style.left = `${position.x}px`;
        commentDiv.style.top = `${position.y}px`;

        setTimeout(() => {
            if (commentDiv.parentNode) {
                commentsDiv.removeChild(commentDiv);
            }
            const index = userdata.indexOf(username);
            userdata.splice(index, 1);
        }, 5000);
    }
}

function gift(username) {
    const giftDiv = document.createElement("div");
    giftDiv.className = "gift";
    giftDiv.innerText = "";

    for (let i = 0; i < username.length; i++) {
        const spanEl = document.createElement('span');
        spanEl.textContent = username.charAt(i);
        giftDiv.appendChild(spanEl);
    }

    // Temporarily add the div to the DOM to get the dimensions
    giftsDiv.appendChild(giftDiv);
    const giftSize = giftDiv.getBoundingClientRect();
    const position = getRandomPosition(giftSize.width, giftSize.height);
    giftDiv.style.left = `${position.x}px`;
    giftDiv.style.top = `${position.y}px`;

    setTimeout(() => {
        if (giftDiv.parentNode) {
            giftsDiv.removeChild(giftDiv);
        }
    }, 10000);


}
function gift1(username) {
    // Eğer username zaten usernames Map'inde bulunuyorsa, işlemi sonlandır
    if (usernames.has(username)) {
        return;
    }

    // username'i usernames Map'ine ekle ve şu anki zamanı değer olarak ata
    usernames.set(username, Date.now());

    // 30 saniye sonra username'i kontrol et ve eğer süre geçtiyse usernames Map'inden çıkar
    setTimeout(() => {
        const timestamp = usernames.get(username);
        if (Date.now() - timestamp >= 30000) {
            usernames.delete(username);
        }
    }, 30000);

    // ...
    // Geri kalan gift fonksiyonu kodu
    // ...
}


connection.on('like', (data) => {
    let userName = data.uniqueId;
    let likeCount = data.likeCount;
    let profilePictureUrl = data.profilePictureUrl;
    comment(userName);

    const messages = [
        { text: " Beğendiğin için teşekkür ederim", language: "tr" },
        { text: " Thank you for liking", language: "en" },
    ];

    function getRandomMessage(messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
    const randomMessage = getRandomMessage(messages);


    let end = { text: data.nickname + randomMessage.text, language: randomMessage.language, };

    if (!usernames.has(userName)) {
        messagesQueue.push(end);
        processQueue();
    }

    gift1(userName);
});


connection.on('member', (data) => {

    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    comment(userName);

    const messages = [
        { text: " hoş geldin", language: "tr" },
        { text: " welcome", language: "en" },
    ];

    function getRandomMessage(messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
    const randomMessage = getRandomMessage(messages);


    let end = { text: data.nickname + randomMessage.text, language: randomMessage.language, };

    if (!usernames.has(userName)) {
        messagesQueue.push(end);
        processQueue();
    }
    gift1(userName);

})

connection.on('social', (data) => {

    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    let userlistExist = false;

    comment(userName);
})



// // New gift received
connection.on('gift', (data) => {

    let userName = data.uniqueId;
    giftCount = (data.diamondCount * data.repeatCount);
    let profilePictureUrl = data.profilePictureUrl;
    const messages = [
        { text: " adlı hesaba herkes takip atsın", language: "tr" },
        { text: " everyone, follow this account", language: "en" },
        { text: "Teşekkür ederim, hediye için!", language: "tr" },
        { text: "Thank you for the gift!", language: "en" },
        { text: "Kendini gösteriyor, onu takip edin", language: "tr" },
        { text: "They are showing themselves, follow them", language: "en" },
    ];

    function getRandomMessage(messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
    const randomMessage = getRandomMessage(messages);


    let end = { text: data.nickname + randomMessage.text, language: randomMessage.language, };



    gift(userName);
    if (!usernames.has(userName)) {
        messagesQueue.push(end);
        processQueue();
    }


    gift1(userName);
})


function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

// End
connection.on('streamEnd', () => {
    $('#stateText').text('Canlı sona çatdı.');
})
