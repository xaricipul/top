

// DATA
let defaultRate = 1.2; // Hızı varsayılan 1.5 katına çıkarır

let usernames = new Map();
let connection = new TikTokIOConnection(undefined);
let finishGame = false;
let iconList = [];
let nextId = 1;
let winner = [];
let animationID;
let giftmsg = "hədiyyə üçün təşəkkür";
let followmsg = "takip üçün təşəkkür";
let membermsg = "xoş gəldin";
let sharemsg = "paylaşdığın üçün təşəkkür";
let likemsg = "bəyəndiyin üçün təşəkkür";
let messagesQueue = [];
// START
$(document).ready(() => {

    // $("#targetConnect").click(function (e) {
    //     // Check
    //     let targetLive = $("#targetUsername").val();
    //     connect(targetLive);

    // });

    setTimeout(function () {
        let targetLive = "@oyun_aze";
        connect(targetLive);
    }, 5000);
})

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
     


        const messages = [
            { text: " adlı hesaba her kes takip atsın", language: "tr" },
            { text: "Teşekkür ederim, hediye için!", language: "tr" },
            { text: "Kendini gösteriyor, onu takip edin", language: "tr" },
            { text: "Harikasın, toplu takip gönderin", language: "tr" },
            { text: "Kesene bereket", language: "tr" },
            { text: "Seni çok seviyorum ,Her kes hesabına takip atsin", language: "tr" },
            { text: "Geri dönüşleri çok iyi hemen takip et", language: "tr" },
    
        ];
    
        messagesQueue = messagesQueue.filter(item => item.type !== 'random')
    
        function getRandomMessage(messages) {
            const randomIndex = Math.floor(Math.random() * messages.length);
            return messages[randomIndex];
        }
        const randomMessage = getRandomMessage(messages);
    
    
        let end = { text: data.nickname + randomMessage.text, language: randomMessage.language, type: 'gift' }; // type ekle
    
        if (!usernames.has(userName)) {
            messagesQueue.push(end);
            processQueue();
        }
    
        lakaka1(userName);

        gift(userName, profilePictureUrl)
});


function gift(username, imageUrl) {
    var container = document.getElementById("container");
    console.log(container)
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


connection.on('member', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
   

    member(userName, profilePictureUrl)
    
    messagesQueue = messagesQueue.filter(item => item.type !== 'random');


    const messages = [
        { text: " hoş geldin", language: "tr" },
        { text: " Seni bekliyorduk", language: "tr" },
        { text: " Hoş geldin ,Lütfen arkadaşlarını davet et", language: "tr" },
        { text: " Hoş geldin , Seni Seviyoruz", language: "tr" },
        { text: " Desteğin için teşekkür ederiz", language: "tr" },
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
    lakaka1(userName);

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


function containsBannedWords(text) {
    const bannedWords = ["pox", "cindir", "amciq", "got", "meme", "məmə", "dillaq", "dıllağ", "göt", "amcıq", "Bok", "am", "kahbe", "Qəhbə", "Qancıx", "Götveren"];

    for (const word of bannedWords) {
        if (text.match(new RegExp('\\b' + word + '\\b', 'gi'))) {
            return true;
        }
    }

    return false;
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

function speak(text) {
    if (containsBannedWords(text)) {
        text = "söyüş söyme";
        let ms = [
            { text: text, language: "en" }]

    }
    responsiveVoice.speak(ms, "Turkish Male", { rate: defaultRate, onend: onEnd });
}

function onEnd() {
    messagesQueue.shift();
    processQueue();
}


setInterval(addRandomMessage, 20000);


function addRandomMessage() {
    const messages = [
        { text: "İlk üçe gir ve takip al", language: "tr" },
        { text: "Hepinize Teşekkür ederim", language: "tr" },
        { text: "Hediyye gönderenin hesabı daha büyük görüntüleniyor", language: "tr" },
        { text: "Sadece sonuncu hediye gönderenin hesabı görüntüleniyor", language: "tr" },
        { text: "Sonuncu hediye gönderen ol hesabın görünsün", language: "tr" },
        { text: "Hesabımı takip et hesabın ekranda görünsün", language: "tr" },
        { text: "Beğeni ve hediye gönderenleri takip et", language: "tr" },
        { text: "Canlını paylaş", language: "tr" },
        { text: "Yorum yaz, karşılığında takip ederim", language: "tr" },
        { text: "Hediyye gönderenin hesabı daha büyük görüntüleniyor", language: "tr" },
        { text: "Sonuncu hediye gönderen ol! hesabın görünsün", language: "tr" },
        { text: "yayımı paylaşanın hesabı ekranda görüntüleniyor", language: "tr" },

        { text: "Harikasınız", language: "tr" },
        { text: "Birlikte büyüyelim, beğen ve takip et", language: "tr" },
        { text: "Topluluğa katıl, takip et ve etkileşime gir", language: "tr" },
        { text: "Beğen ve yorum yap, karşılığında takip ederim", language: "tr" },
        { text: "Bağlantıda kal, takip et ve paylaş", language: "tr" },
        { text: "Güncellemeler için bildirimleri aç", language: "tr" },
        { text: "Hediyye gönderenin hesabı daha büyük görüntüleniyor", language: "tr" },
        { text: "Hesabı görüntülenene toplu takip gönderin", language: "tr" },
        { text: "yayımı beğenenin hesabı ekranda görüntüleniyor", language: "tr" },
        { text: "Sadece sonuncu hediye gönderenin hesabı görüntüleniyor", language: "tr" },
        { text: "Hesabımı takip et hesabın ekranda görünsün", language: "tr" },
        { text: "Sonuncu hediye gönderen ol hesabın görünsün", language: "tr" },
        { text: "yayımı paylaşanın hesabı ekranda görüntüleniyor", language: "tr" },

        { text: "Müthişsiniz, teşekkürler", language: "tr" },
        { text: "Pozitif enerjiyi sürdür, beğen ve takip et", language: "tr" },
        { text: "Birlikte daha güçlüyüz, destekle ve takip et", language: "tr" },
        { text: "Paylaşmak önemsemektir, takip et ve yeniden paylaş", language: "tr" },
        { text: "Daha fazla içerik için takipte kal", language: "tr" },
        { text: "Yeni arkadaşlar keşfet, takip et ve etkileşime gir", language: "tr" },
        { text: "Birbirimize ilham verelim, beğen ve takip et", language: "tr" },
        { text: "Özel içerik için takip et", language: "tr" },
        { text: "Hediyye gönderenin hesabı daha büyük görüntüleniyor", language: "tr" },
        { text: "Hesabı görüntülenene toplu takip gönderin", language: "tr" },
        { text: "yayımı beğenenin hesabı ekranda görüntüleniyor", language: "tr" },
        { text: "Hesabımı takip et hesabın ekranda görünsün", language: "tr" },
        { text: "Sonuncu hediye gönderen ol hesabın görünsün", language: "tr" },
        { text: "yayımı paylaşanın hesabı ekranda görüntüleniyor", language: "tr" },
        { text: "Hesabımı takip et hesabın ekranda görünsün", language: "tr" },
        { text: "Beğeni bırak, takipçi kazan", language: "tr" },
        { text: "Harika işler çıkarmaya devam edin, teşekkürler", language: "tr" },
        { text: "Bağlan ve büyü, takip et ve destekle", language: "tr" },
        { text: "Hediyye gönderenin hesabı daha büyük görüntüleniyor", language: "tr" },
        { text: "Hesabı görüntülenene toplu takip gönderin", language: "tr" },
        { text: "yayımı beğenenin hesabı ekranda görüntüleniyor", language: "tr" },
        { text: "Sadece sonuncu hediye gönderenin hesabı görüntüleniyor", language: "tr" },
        { text: "Hesabımı takip et hesabın ekranda görünsün", language: "tr" },
        { text: "Sonuncu hediye gönderen ol hesabın görünsün", language: "tr" },
        { text: "yayımı paylaşanın hesabı ekranda görüntüleniyor", language: "tr" },

        { text: "Sohbete katıl, yorum yap ve takip et", language: "tr" },
        { text: "Yeni fikirler keşfet, takip et ve paylaş", language: "tr" },
        { text: "Güncel kal, takip et ve bildirimleri aç", language: "tr" },
        { text: "Takip et ve düşüncelerini paylaş", language: "tr" },
        { text: "Hediyye gönderenin hesabı daha büyük görüntüleniyor", language: "tr" },
        { text: "Hesabı görüntülenene toplu takip gönderin", language: "tr" },
        { text: "yayımı beğenenin hesabı ekranda görüntüleniyor", language: "tr" },
        { text: "Sadece sonuncu hediye gönderenin hesabı görüntüleniyor", language: "tr" },

        { text: "Sonuncu hediye gönderen ol hesabın görünsün", language: "tr" },
        { text: "yayımı paylaşanın hesabı ekranda görüntüleniyor", language: "tr" },
        { text: "Hesabımı takip et hesabın ekranda görünsün", language: "tr" },
        { text: "Karşılıklı destek için beğen ve yorum yap", language: "tr" },
        { text: "Pozitif bir topluluk oluştur, takip et ve etkileşime gir", language: "tr" },
        { text: "Desteğiniz için teşekkür ederiz", language: "tr" },
        { text: "Hediye gönderdiğinde hesabını seslendiriyorum", language: "tr" },
        { text: "Lütfen yayımı beyenin", language: "tr" },
        { text: "Hesabı görüntülenene toplu takip gönderin", language: "tr" },
        { text: "yayımı beğenenin hesabı ekranda görüntüleniyor", language: "tr" },
        { text: "Sadece sonuncu hediye gönderenin hesabı görüntüleniyor", language: "tr" },

        { text: "Sonuncu hediye gönderen ol hesabın görünsün", language: "tr" },
        { text: "yayımı paylaşanın hesabı ekranda görüntüleniyor", language: "tr" },

        { text: "Sandık koy daha çok takipçi kazan", language: "tr" },
        { text: "Hesabımı takip et hesabın ekranda görünsün", language: "tr" },

    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    messagesQueue.push({ ...randomMessage, type: 'random' }); // type ekle
    processQueue();
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


function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

// End
connection.on('streamEnd', () => {
    $('#stateText').text('Canlı sona çatdı.');
})
