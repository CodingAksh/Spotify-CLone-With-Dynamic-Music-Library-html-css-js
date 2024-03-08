let currentSong = new Audio
let songs;
let currFolder;

function formatTime(time) {

    if (isNaN(time) || time < 0) {
        return "00:00"
    }
    // Format time in MM:SS
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')} :${String(seconds).padStart(2, '0')}`;
}

function formatTime(time) {

    if (isNaN(time) || time < 0) {
        return "00:00"
    }
    // Format time in MM:SS
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let responce = await a.text()

    let div = document.createElement("div")
    div.innerHTML = responce
    let as = div.getElementsByTagName("a")

    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // console.log(as)
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs
}


let playMusic = (track, pause = false) => {

    currentSong.src = `/${currFolder}/` + track

    if (!pause) {
        currentSong.play()
        play.src = "../icons/pause.svg"
    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 

        <img class="invert" src="../icons/music.svg" alt="">
                        <div class="info">
                            <div class="songName">${song.replaceAll("%20", " ")}</div>
                            <div>Akash</div>
                        </div>
                        <div class="playNow">
                            <span>Play Now</span>
                            <img class="invert" src="../icons/player.svg" alt="">
                        </div>
         </li>`;
    }

    //Attatched and eventlisner to each songs

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })


}
//Making Dynamic albums

async function DisplayAlbum() {
    let a = await fetch("/Songs/")
    let responce = await a.text()
    let div = document.createElement("div")
    div.innerHTML = responce
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/Songs")) {
            let folder = (e.href.split("/").slice(-2)[0]);

            //get the metadata of each folder

            let a = await fetch(`/Songs/${folder}/info.json`)
            let responce = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="playBtnContainer">
                <div class="playBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                          style="fill: rgba(0, 0, 0, 1);">
                        <path d="M7 6v12l10-6z"></path>
                    </svg>
                </div>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="lofi beats">
            <h2>${responce.title}</h2>
            <p>${responce.description}</p>
        </div>`
        }
    }
    //Get the Songs when his album is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    })

}



async function main() {

    //get the list of all the songs
    songs = await getSongs("Songs/ncs")
    playMusic(songs[0], true)

    //Displaying all the albums on the page

    DisplayAlbum()

    // Attatched and eventlisner to the prev , play and next button

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "../icons/pause.svg"
        }

        else {
            currentSong.pause()
            play.src = "../icons/player.svg"
        }
    })



    //TimeUpdate Event

    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        document.querySelector(".undSeekbar").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event lisner on seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    document.getElementById("part").addEventListener("click", function () {
        let undSeekbar = document.querySelector(".undSeekbar");
        let part = document.getElementById("part");

        // Calculate the new width based on the click position
        undSeekbar.style.width = (part.offsetWidth / undSeekbar.offsetWidth) * 100 + "%"
    });


    //Function to make the hamburger working on smaller screen

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"

    })

    // add the eventlisner to the downarrow
    let Premium = document.querySelector(".buttons")
    document.querySelector(".downArr").addEventListener("click", () => {
        Premium.classList.toggle("actCont")
    })


    // add evenetlisner on prev and next button

    // This code listens for clicks on "previous" and "next" buttons, finds the index of the current song in a list, and plays the previous or next song in the list if available.
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1])

        if ([index - 1] >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    //automaticallly plays the next song when the current song is end

    currentSong.addEventListener("ended", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }

    });

    //Making the Working Volume bar

    let volumeBar = document.getElementById("volume")

    volumeBar.addEventListener("change", (e) => {
        currentSong.volume = e.target.value / 100
    })

    // Get the volume icon element

    let volumeIcon = document.querySelector(".VolumeIcon");
    volumeBar.value = 100;

    // Add a click event listener to the volume icon
    volumeIcon.addEventListener("click", function () {
        // Toggle the acitive class on the volume bar

        volumeBar.classList.toggle("active");
    });

    volume.addEventListener("input", function () {
        // Check if the volume value is 0
        if (volumeBar.value == 0) {

            volumeIcon.src = "../icons/mute.svg";
        } else {

            volumeIcon.src = "../icons/volume.svg";
        }

    });
}

main()
