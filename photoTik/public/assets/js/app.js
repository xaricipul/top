// DATA


let connection = new TikTokIOConnection(undefined);
let userGiftTotal = 0;
let user2GiftTotal = 0;
let userlistExist = null;
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
let finishGame = false;
let iconList = [];
let nextId = 1;
const winner = [];

// START
$(document).ready(() => {
    // Resize



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


function deleteAllIcons() {
    const allIcons = document.querySelectorAll(".icon"); // tüm ikonlar

    // Tüm ikonları döngüye alarak sil
    allIcons.forEach((icon) => {
        icon.remove();
    });

    iconList = []; // 

    finishGame = false;
}

connection.on('chat', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    let userlistExist = false;
    if (!finishGame) {
        for (let i = 0; i < iconList.length; i++) {
            if (iconList[i].username === userName) {
                iconList[i].size += 0.5; // add 20 to each object's value property
                let icons = document.getElementsByClassName('icon');
                for (let j = 0; j < icons.length; j++) {
                    if (icons[j].src === iconList[i].imgurl) {
                        if (newSize > 400) {
                            icons[j].style.width = iconList[i].size + 'px';
                            icons[j].style.height = iconList[i].size + 'px';
                            icons[j].style.top = ((window.innerHeight - iconList[i].size) / 2) + 'px';
                            icons[j].style.left = ((window.innerWidth - iconList[i].size) / 2) + 'px';
                        }
                        break;
                    }
                }
                userlistExist = true;
                if (iconList[i].size > 400) {
                    iconList[i].size = 400; // if value goes over 400, set it to 400
                    break; // stop the loop if any value goes over 400
                }
            }
        }

        if (!userlistExist) {
            const iconSize = 40 + 0.5;
            const iconImgUrl = profilePictureUrl;

            const icon = {
                x: Math.floor(Math.random() * (canvas.width - iconSize)),
                y: Math.floor(Math.random() * (canvas.height - iconSize)),
                size: iconSize,
                imgUrl: iconImgUrl,
                img: new Image(),
                username: userName,
            };

            iconList.push(icon);

            drawIcons();
        }
    }

});

function createList(username, numOfItems) {
    const list = [];
    
    for (let i = 1; i <= numOfItems; i++) {
      const item = {
        id: i,
        username: `${username}_${i}`
      };
      
      list.push(item);
    }
    
    list.sort((a, b) => a.id - b.id);
    
    return list;
  }
function drawIcons() {
    if (!finishGame) {
        ctx.beginPath();
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.clip();
        ctx.restore();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sort the icons in descending order by size
        iconList.sort((a, b) => b.size - a.size);

        // Define a constant movement speed
        const moveSpeed = 0.1;

        // Draw each icon with its corresponding z-index
        let overlappingIcon = null;
        iconList.forEach((icon, index) => {
            // Update icon position with a fixed speed
            const dx = Math.random() * moveSpeed * 2 - moveSpeed;
            const dy = Math.random() * moveSpeed * 2 - moveSpeed;
            icon.x += dx;
            icon.y += dy;

            // Keep icon within canvas bounds
            icon.x = Math.max(0, Math.min(canvas.width - icon.size, icon.x));
            icon.y = Math.max(0, Math.min(canvas.height - icon.size, icon.y));

            // Check if icon overlaps with largest icon
            if (icon !== iconList[0] &&
                icon.x < canvas.width / 2 + iconList[0].size / 2 &&
                icon.x + icon.size > canvas.width / 2 - iconList[0].size / 2 &&
                icon.y < canvas.height / 2 + iconList[0].size / 2 &&
                icon.y + icon.size > canvas.height / 2 - iconList[0].size / 2) {
                overlappingIcon = icon;
            }

            // Set image source and draw icon
            icon.img.src = icon.imgUrl;

            // Draw a yellow circle
            ctx.beginPath();
            ctx.arc(icon.x + icon.size / 2, icon.y + icon.size / 2, icon.size / 2, 0, 2 * Math.PI);
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Set the zIndex property of the icon
            icon.zIndex = index;


        });

        // Draw overlapping icon outside of yellow circle
        if (overlappingIcon) {
            ctx.drawImage(overlappingIcon.img, overlappingIcon.x, overlappingIcon.y, overlappingIcon.size, overlappingIcon.size);
        }

        // Draw the largest icon last with a higher z-index than other icons
        const largestIcon = iconList[0];
        if (largestIcon) {
            largestIcon.img.src = largestIcon.imgUrl;

            // Set zIndex to highest value
            largestIcon.zIndex = iconList.length;
            // Check zIndex values for all icons in array
            iconList.forEach((icon, index) => {
                if (icon !== largestIcon && icon.zIndex >= largestIcon.zIndex) {
                    icon.zIndex = index;
                }
            });

            // Draw all icons with correct zIndex values
            iconList.sort((a, b) => a.zIndex - b.zIndex);
            iconList.forEach((icon) => {
                // Draw a yellow circle
                ctx.beginPath();
                ctx.arc(icon.x + icon.size / 2, icon.y + icon.size / 2, icon.size / 2, 0, 2 * Math.PI);
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 2;
                ctx.stroke();
                // Draw the icon image inside the circle
                ctx.save();
                ctx.clip();
                ctx.drawImage(icon.img, icon.x, icon.y, icon.size, icon.size);
                ctx.restore();

            });

           // Check if largest icon is equal to canvas size
           if (largestIcon.size >= canvas.width && largestIcon.size >= canvas.height) {
            // Stop all movements
          
            // Draw a white rectangle to clear the canvas
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          
            // Display the image of the largest icon
            var img = new Image();
            img.onload = function() {
                ctx.drawImage(img, canvas.width / 2 - 155, canvas.height / 2 - 155 - 20, 310, 310);
            }
            img.src = largestIcon.imgUrl;
          
            // Display "Congratulations! You Won!" message
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Təbriklər.", canvas.width / 2, canvas.height - 40);
            ctx.fillText("Qazanan hesab : " + largestIcon.username, canvas.width / 2, canvas.height - 20);
            

            
            addWinner(largestIcon.username );

            const canvas2 = document.getElementById("myCanvas2");
            const ctx2 = canvas2.getContext("2d");
          
            // Create the winner list
            ctx2.font = "20px Arial";
            ctx2.fillStyle = "black";
            ctx2.fillText("Qazananlar:", 10, 30);
            for (let i = 0; i < winner.length; i++) {
              ctx2.fillText(winner[i].id  + ' - ' + winner[i].username, 10, 60 + i * 30);
            }
            finishGame = true;
            setTimeout(function () {
                deleteAllIcons()
            }, 30000); // 30 saniye beklet
            return;
          }
        }
        requestAnimationFrame(drawIcons);
    }

}
function addWinner(username) {
    winner.push({
      id: nextId++,
      username: username
    });
  }

  

connection.on('like', (data) => {
    let userName = data.uniqueId;
    let likeCount = data.likeCount;
    let profilePictureUrl = data.profilePictureUrl;
    let userlistExist = false;
    if (!finishGame) {
        for (let i = 0; i < iconList.length; i++) {
            if (iconList[i].username === userName) {
                iconList[i].size += likeCount * 0.04; // add 20 to each object's value property
                let icons = document.getElementsByClassName('icon');
                for (let j = 0; j < icons.length; j++) {
                    if (icons[j].src === iconList[i].imgurl) {
                        if (newSize > 400) {
                            icons[j].style.width = iconList[i].size + 'px';
                            icons[j].style.height = iconList[i].size + 'px';
                            icons[j].style.top = ((window.innerHeight - iconList[i].size) / 2) + 'px';
                            icons[j].style.left = ((window.innerWidth - iconList[i].size) / 2) + 'px';
                        }
                        break;
                    }
                }
                userlistExist = true;
                if (iconList[i].size > 400) {
                    iconList[i].size = 400; // if value goes over 400, set it to 400
                    break; // stop the loop if any value goes over 400
                }
            }
        }

        if (!userlistExist) {
            const iconSize = 40 + (likeCount * 0.05);
            const iconImgUrl = profilePictureUrl;

            const icon = {
                x: Math.floor(Math.random() * (canvas.width - iconSize)),
                y: Math.floor(Math.random() * (canvas.height - iconSize)),
                size: iconSize,
                imgUrl: iconImgUrl,
                img: new Image(),
                username: userName,
            };

            iconList.push(icon);

            drawIcons();
        }
    }

});

// Member join
connection.on('member', (data) => {


})

connection.on('social', (data) => {
    let userName = data.uniqueId;
    let profilePictureUrl = data.profilePictureUrl;
    let userlistExist = false;
    if (!finishGame) {
        for (let i = 0; i < iconList.length; i++) {
            if (iconList[i].username === userName) {
                iconList[i].size += 0.5; // add 20 to each object's value property
                let icons = document.getElementsByClassName('icon');
                for (let j = 0; j < icons.length; j++) {
                    if (icons[j].src === iconList[i].imgurl) {
                        if (newSize > 400) {
                            icons[j].style.width = iconList[i].size + 'px';
                            icons[j].style.height = iconList[i].size + 'px';
                            icons[j].style.top = ((window.innerHeight - iconList[i].size) / 2) + 'px';
                            icons[j].style.left = ((window.innerWidth - iconList[i].size) / 2) + 'px';
                        }
                        break;
                    }
                }
                userlistExist = true;
                if (iconList[i].size > 400) {
                    iconList[i].size = 400; // if value goes over 400, set it to 400
                    break; // stop the loop if any value goes over 400
                }
            }
        }

        if (!userlistExist) {
            const iconSize = 40 + 0.5;
            const iconImgUrl = profilePictureUrl;

            const icon = {
                x: Math.floor(Math.random() * (canvas.width - iconSize)),
                y: Math.floor(Math.random() * (canvas.height - iconSize)),
                size: iconSize,
                imgUrl: iconImgUrl,
                img: new Image(),
                username: userName,
            };

            iconList.push(icon);

            drawIcons();
        }
    }

})



// // New gift received
connection.on('gift', (data) => {
    let userName = data.uniqueId;
    giftCount = (data.diamondCount * data.repeatCount);
    let profilePictureUrl = data.profilePictureUrl;
    let userlistExist = false;
    if (!finishGame) {
        for (let i = 0; i < iconList.length; i++) {
            if (iconList[i].username === userName) {
                iconList[i].size += giftCount * 1.5; // add 20 to each object's value property
                let icons = document.getElementsByClassName('icon');
                for (let j = 0; j < icons.length; j++) {
                    if (icons[j].src === iconList[i].imgurl) {
                        if (newSize > 400) {
                            icons[j].style.width = iconList[i].size + 'px';
                            icons[j].style.height = iconList[i].size + 'px';
                            icons[j].style.top = ((window.innerHeight - iconList[i].size) / 2) + 'px';
                            icons[j].style.left = ((window.innerWidth - iconList[i].size) / 2) + 'px';
                        }
                        break;
                    }
                }
                userlistExist = true;
                if (iconList[i].size > 400) {
                    iconList[i].size = 400; // if value goes over 400, set it to 400
                    break; // stop the loop if any value goes over 400
                }
            }
        }

        if (!userlistExist) {
            const iconSize = 40 + (giftCount * 1.5);
            const iconImgUrl = profilePictureUrl;

            const icon = {
                x: Math.floor(Math.random() * (canvas.width - iconSize)),
                y: Math.floor(Math.random() * (canvas.height - iconSize)),
                size: iconSize,
                imgUrl: iconImgUrl,
                img: new Image(),
                username: userName,
            };

            iconList.push(icon);

            drawIcons();
        }
    }

})


function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

// End
connection.on('streamEnd', () => {
    $('#stateText').text('Canlı sona çatdı.');
})
