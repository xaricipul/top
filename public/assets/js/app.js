// DATA

let defaultRate = 1.2; // Hızı varsayılan 1.5 katına çıkarır

let usernames = new Map();

let connection = new TikTokIOConnection(undefined);
let userdata = [];
let commentsDiv;
let giftsDiv;

let lastActivityTime = Date.now();


let messagesQueue = [];
$(document).ready(() => {

    // $("#targetConnect").click(function (e) {
    //     // Check
    //     let targetLive = $("#targetUsername").val();
    //     connect(targetLive);

    // });

    setTimeout(function () {
        let targetLive = "oyun_aze";
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
    if (messagesQueue.length > 0) {
        // Şu anda seslendirme yapılıp yapılmadığını kontrol et
        if (!responsiveVoice.isPlaying()) {
            let message = messagesQueue[0].text;
            let language = messagesQueue[0].language;

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
        } else {
            // Eğer şu anda seslendirme yapılıyorsa, bekleyen sesleri sil ve yeni mesajları ekle
            messagesQueue.shift();
            processQueue();
        }
    }
}


function addRandomMessage() {
    const messages = [
        { text: "İlk üçe gir ve takip al", language: "tr" },
        { text: "Hepinize Teşekkür ederim", language: "tr" },
        { text: "Beğeni ve hediye gönderenleri takip et", language: "tr" },
        { text: "Canlını paylaş", language: "tr" },
        { text: "Sevginizi gösterin, beğen ve takip et", language: "tr" },
        { text: "Yorum yaz, karşılığında takip ederim", language: "tr" },
        { text: "Harikasınız", language: "tr" },
        { text: "Sevgiyi yay, takip et ve destekle", language: "tr" },
        { text: "Birlikte büyüyelim, beğen ve takip et", language: "tr" },
        { text: "Topluluğa katıl, takip et ve etkileşime gir", language: "tr" },
        { text: "Günlük içerik için takip et", language: "tr" },
        { text: "Beğen ve yorum yap, karşılığında takip ederim", language: "tr" },
        { text: "Bağlantıda kal, takip et ve paylaş", language: "tr" },
        { text: "Güncellemeler için bildirimleri aç", language: "tr" },
        { text: "Müthişsiniz, teşekkürler", language: "tr" },
        { text: "Pozitif enerjiyi sürdür, beğen ve takip et", language: "tr" },
        { text: "Birlikte daha güçlüyüz, destekle ve takip et", language: "tr" },
        { text: "Paylaşmak önemsemektir, takip et ve yeniden paylaş", language: "tr" },
        { text: "Daha fazla içerik için takipte kal", language: "tr" },
        { text: "Yeni arkadaşlar keşfet, takip et ve etkileşime gir", language: "tr" },
        { text: "Birbirimize ilham verelim, beğen ve takip et", language: "tr" },
        { text: "Özel içerik için takip et", language: "tr" },
        { text: "Beğeni bırak, takipçi kazan", language: "tr" },
        { text: "Harika işler çıkarmaya devam edin, teşekkürler", language: "tr" },
        { text: "Bağlan ve büyü, takip et ve destekle", language: "tr" },
        { text: "Motivasyon içerikleri için takip et", language: "tr" },
        { text: "Sohbete katıl, yorum yap ve takip et", language: "tr" },
        { text: "Yeni fikirler keşfet, takip et ve paylaş", language: "tr" },
        { text: "Güncel kal, takip et ve bildirimleri aç", language: "tr" },
        { text: "Takip et ve düşüncelerini paylaş", language: "tr" },
        { text: "Karşılıklı destek için beğen ve yorum yap", language: "tr" },
        { text: "Pozitif bir topluluk oluştur, takip et ve etkileşime gir", language: "tr" },
        { text: "Desteğiniz için teşekkür ederiz", language: "tr" },
        { text: "Hediye gönderdiğinde hesabını seslendiriyorum", language: "tr" },
        { text: "Lütfen yayımı beyenin", language: "tr" },
        { text: "Sandık koy daha çok takipçi kazan", language: "tr" },



    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    messagesQueue.push({ ...randomMessage, type: 'random' }); // type ekle
    processQueue();
}

// Otomatik seslendirme başlatma
window.addEventListener("load", async () => {
    try {
        // Kullanıcıdan otomatik seslendirmeye izin isteyin
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.resume();


    } catch (error) {
        console.error("Otomatik seslendirme başlatılamadı:", error);
    }
});


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

setInterval(addRandomMessage, 10000);

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

function lakaka(username) {
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
function lakaka1(username) {


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


});


connection.on('member', (data) => {

    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    comment(userName);

    messagesQueue = messagesQueue.filter(item => item.type !== 'random');


    const messages = [
        { text: " hoş geldin", language: "tr" },
        { text: " Seni bekliyorduk", language: "tr" },
        { text: " Hoş geldin ,Lütfen arkadaşlarını davet et", language: "tr" },
        { text: " Hoş geldin , Seni Seviyoruz", language: "tr" },
        { text: " Desteğin için teşekkür ederiz", language: "tr" },
        

        // { text: " welcome", language: "en" },
    ];

    function getRandomMessage(messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
    const randomMessage = getRandomMessage(messages);


    let end = { text: data.nickname + randomMessage.text, language: randomMessage.language, type: 'member' };

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

    messagesQueue = messagesQueue.filter(item => item.type !== 'random');

    let userName = data.uniqueId;
    giftCount = (data.diamondCount * data.repeatCount);
    let profilePictureUrl = data.profilePictureUrl;
    const messages = [
        { text: " adlı hesaba her kes takip atsın", language: "tr" },
        { text: "Teşekkür ederim, hediye için!", language: "tr" },
        { text: "Kendini gösteriyor, onu takip edin", language: "tr" },
        { text: "Harikasın, toplu takip gönderin", language: "tr" },
        { text: "Kesene bereket", language: "tr" },
        { text: "Bir Tanesin ,Her kes takip etsin", language: "tr" },
        { text: "Seni çok seviyorum ,Her kes hesabına takip atsin", language: "tr" },
        { text: "Geri dönüşleri çok iyi hemen takip et", language: "tr" },
    ];

    function getRandomMessage(messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
    const randomMessage = getRandomMessage(messages);


    let end = { text: data.nickname + randomMessage.text, language: randomMessage.language, type: 'gift' }; // type ekle

    lakaka(userName);
    if (!usernames.has(userName)) {
        messagesQueue.push(end);
        processQueue();
    }


    lakaka1(userName);
})


function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

// End
connection.on('streamEnd', () => {
    $('#stateText').text('Canlı sona çatdı.');
})
