window.onload = () => {
    initialize();
    initObserver();
    document.addEventListener("mouseup", (e) => {
        const downloadMenu =
            document.getElementsByClassName("ytp-download-menu");
        const downloadBtn = document.getElementsByClassName(
            "ytp-download-button"
        );
        if (
            downloadMenu.length > 0 &&
            downloadBtn.length > 0 &&
            !downloadBtn[0].contains(e.target) &&
            downloadMenu[0].style.display === "block"
        ) {
            downloadMenu[0].style.display = "none";
        }
    });
};

function initObserver() {
    let lastUrl = location.href;
    let lastTitle = document.title;
    new MutationObserver(() => {
        const url = location.href;
        const title = document.title;
        if (
            url !== lastUrl &&
            url.indexOf("https://www.youtube.com/watch") != -1 &&
            title !== lastTitle
        ) {
            lastUrl = url;
            lastTitle = title;
            initialize();
        }
    }).observe(document.getElementsByTagName("title")[0], {
        subtree: true,
        childList: true,
    });
}

function initialize() {
    const youtubeRightBtn =
        document.getElementsByClassName("ytp-right-controls");

    if (youtubeRightBtn.length > 0) {
        Browser().storage.local.get("isConnected", (data) => {
            if (data.isConnected) {
                createDownloadBtn({
                    controlsBtn: youtubeRightBtn,
                    isLoading: false,
                    error: false,
                });
                removeElementsByClass("ytp-download-menu");
                initDownloadPopup();
            } else {
                removeElementsByClass("ytp-download-menu");
                removeElementsByClass("ytp-download-button");
            }
        });
    }
}

Browser().storage.onChanged.addListener((changes, area) => {
    if (changes.isConnected) {
        initialize();
    }
});

function createDownloadBtn({ controlsBtn, isLoading, error }) {
    let ytpDownlaodBtn = document.getElementsByClassName(
        "ytp-download-button"
    )[0];

    if (!ytpDownlaodBtn) {
        ytpDownlaodBtn = document.createElement("button");
        ytpDownlaodBtn.classList.add("ytp-button", "ytp-download-button");
        ytpDownlaodBtn.title = "Download Video";
    }

    if (error) {
        ytpDownlaodBtn.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.3299 26C10.0981 26.0009 9.86998 25.94 9.66805 25.8232C9.46612 25.7063 9.29731 25.5376 9.17819 25.3335C9.06155 25.1317 9 24.9014 9 24.6668C9 24.4321 9.06155 24.2018 9.17819 24L16.8478 10.6673C16.9675 10.4637 17.1363 10.2953 17.3381 10.1784C17.5399 10.0615 17.7677 10 17.9994 10C18.2311 10 18.4589 10.0615 18.6607 10.1784C18.8625 10.2953 19.0313 10.4637 19.151 10.6673L26.8218 24C26.9385 24.2018 27 24.4321 27 24.6668C27 24.9014 26.9385 25.1317 26.8218 25.3335C26.7028 25.5376 26.534 25.7064 26.332 25.8233C26.1301 25.9401 25.902 26.001 25.6701 26H10.3299ZM18.0041 13.6923C17.6859 13.6923 17.3807 13.8219 17.1557 14.0527C16.9307 14.2836 16.8044 14.5966 16.8044 14.923V19.8461C16.8044 20.1725 16.9307 20.4856 17.1557 20.7164C17.3807 20.9472 17.6859 21.0769 18.0041 21.0769C18.3222 21.0769 18.6274 20.9472 18.8524 20.7164C19.0773 20.4856 19.2037 20.1725 19.2037 19.8461V14.923C19.2037 14.5966 19.0773 14.2836 18.8524 14.0527C18.6274 13.8219 18.3222 13.6923 18.0041 13.6923ZM18.0041 24.7692C18.2413 24.7692 18.4733 24.697 18.6706 24.5618C18.8679 24.4265 19.0216 24.2343 19.1124 24.0094C19.2032 23.7846 19.227 23.5371 19.1807 23.2983C19.1344 23.0596 19.0201 22.8403 18.8524 22.6682C18.6846 22.496 18.4708 22.3788 18.2381 22.3313C18.0054 22.2838 17.7642 22.3082 17.5449 22.4014C17.3257 22.4945 17.1384 22.6523 17.0065 22.8547C16.8747 23.0571 16.8044 23.295 16.8044 23.5384C16.8044 23.8649 16.9307 24.1779 17.1557 24.4087C17.3807 24.6395 17.6859 24.7692 18.0041 24.7692Z" fill="#FF3333"/>
</svg>`;
        ytpDownlaodBtn.style.animation = "";
        ytpDownlaodBtn.onclick = function () {};
        [...controlsBtn].forEach((element) => {
            element.appendChild(ytpDownlaodBtn);
        });
        return;
    }

    if (isLoading) {
        ytpDownlaodBtn.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9 23.4C19.3774 23.4 19.8352 23.5896 20.1728 23.9272C20.5104 24.2647 20.7 24.7226 20.7 25.2C20.7 25.6773 20.5104 26.1352 20.1728 26.4728C19.8352 26.8103 19.3774 27 18.9 27C18.4226 27 17.9648 26.8103 17.6272 26.4728C17.2897 26.1352 17.1 25.6773 17.1 25.2C17.1 24.7226 17.2897 24.2647 17.6272 23.9272C17.9648 23.5896 18.4226 23.4 18.9 23.4ZM13.2669 20.7C13.8636 20.7 14.4359 20.937 14.8579 21.359C15.2799 21.7809 15.5169 22.3532 15.5169 22.95C15.5169 23.5467 15.2799 24.119 14.8579 24.5409C14.4359 24.9629 13.8636 25.2 13.2669 25.2C12.6702 25.2 12.0979 24.9629 11.6759 24.5409C11.254 24.119 11.0169 23.5467 11.0169 22.95C11.0169 22.3532 11.254 21.7809 11.6759 21.359C12.0979 20.937 12.6702 20.7 13.2669 20.7V20.7ZM23.6871 21.15C24.1645 21.15 24.6224 21.3396 24.9599 21.6772C25.2975 22.0147 25.4871 22.4726 25.4871 22.95C25.4871 23.4273 25.2975 23.8852 24.9599 24.2227C24.6224 24.5603 24.1645 24.75 23.6871 24.75C23.2097 24.75 22.7519 24.5603 22.4143 24.2227C22.0768 23.8852 21.8871 23.4273 21.8871 22.95C21.8871 22.4726 22.0768 22.0147 22.4143 21.6772C22.7519 21.3396 23.2097 21.15 23.6871 21.15V21.15Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M25.65 17.3872C26.008 17.3872 26.3514 17.5294 26.6046 17.7826C26.8578 18.0358 27 18.3792 27 18.7372C27 19.0953 26.8578 19.4386 26.6046 19.6918C26.3514 19.945 26.008 20.0872 25.65 20.0872C25.2919 20.0872 24.9486 19.945 24.6954 19.6918C24.4422 19.4386 24.3 19.0953 24.3 18.7372C24.3 18.3792 24.4422 18.0358 24.6954 17.7826C24.9486 17.5294 25.2919 17.3872 25.65 17.3872Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 14.4C11.8467 14.4 12.419 14.637 12.841 15.059C13.263 15.4809 13.5 16.0532 13.5 16.65C13.5 17.2467 13.263 17.819 12.841 18.241C12.419 18.6629 11.8467 18.9 11.25 18.9C10.6533 18.9 10.081 18.6629 9.65901 18.241C9.23705 17.819 9 17.2467 9 16.65C9 16.0532 9.23705 15.4809 9.65901 15.059C10.081 14.637 10.6533 14.4 11.25 14.4V14.4ZM25.0074 13.6863C25.2461 13.6863 25.475 13.7811 25.6438 13.9499C25.8126 14.1187 25.9074 14.3476 25.9074 14.5863C25.9074 14.825 25.8126 15.0539 25.6438 15.2227C25.475 15.3915 25.2461 15.4863 25.0074 15.4863C24.7687 15.4863 24.5398 15.3915 24.371 15.2227C24.2022 15.0539 24.1074 14.825 24.1074 14.5863C24.1074 14.3476 24.2022 14.1187 24.371 13.9499C24.5398 13.7811 24.7687 13.6863 25.0074 13.6863Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2 9C16.9161 9 17.6028 9.28446 18.1092 9.79081C18.6155 10.2972 18.9 10.9839 18.9 11.7C18.9 12.4161 18.6155 13.1028 18.1092 13.6092C17.6028 14.1155 16.9161 14.4 16.2 14.4C15.4839 14.4 14.7972 14.1155 14.2908 13.6092C13.7845 13.1028 13.5 12.4161 13.5 11.7C13.5 10.9839 13.7845 10.2972 14.2908 9.79081C14.7972 9.28446 15.4839 9 16.2 9V9ZM22.95 11.7C23.0694 11.7 23.1838 11.7474 23.2682 11.8318C23.3526 11.9162 23.4 12.0307 23.4 12.15C23.4 12.2694 23.3526 12.3838 23.2682 12.4682C23.1838 12.5526 23.0694 12.6 22.95 12.6C22.8307 12.6 22.7162 12.5526 22.6318 12.4682C22.5474 12.3838 22.5 12.2694 22.5 12.15C22.5 12.0307 22.5474 11.9162 22.6318 11.8318C22.7162 11.7474 22.8307 11.7 22.95 11.7V11.7Z" fill="white"/>
    </svg>`;

        ytpDownlaodBtn.style.animation =
            "ytp-spinner-linspin 1568.2352941176ms linear infinite";
        ytpDownlaodBtn.onclick = function () {};
        [...controlsBtn].forEach((element) => {
            element.appendChild(ytpDownlaodBtn);
        });
        return;
    }

    ytpDownlaodBtn.onclick = function () {
        const downloadMenu =
            document.getElementsByClassName("ytp-download-menu");
        if (downloadMenu.length > 0) {
            downloadMenu[0].style.display =
                downloadMenu[0].style.display === "block" ? "none" : "block";
        }
    };

    ytpDownlaodBtn.style.animation = "";

    ytpDownlaodBtn.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use class="ytp-svg-shadow"></use>
    <path d="M16.3718 10H19.6323C20.1743 10 20.6104 10.4459 20.6104 11.0002V18.0016H24.1847C24.9101 18.0016 25.2729 18.8976 24.7593 19.4227L18.5604 25.7656C18.2547 26.0781 17.7534 26.0781 17.4478 25.7656L11.2407 19.4227C10.7271 18.8976 11.0899 18.0016 11.8153 18.0016H15.3937V11.0002C15.3937 10.4459 15.8298 10 16.3718 10Z" fill="white"/>
    </svg>
        `;

    [...controlsBtn].forEach((element) => {
        element.appendChild(ytpDownlaodBtn);
    });
}

function initDownloadPopup() {
    const moviePlayer = document.getElementById("movie_player");
    const downloadPopup = document.createElement("div");
    downloadPopup.classList.add(
        "ytp-popup",
        "ytp-settings-menu",
        "ytp-download-menu"
    );
    downloadPopup.style.width = "150px";
    downloadPopup.style.height = "225px";
    downloadPopup.setAttribute("data-layer", 6);
    downloadPopup.style.display = "none";

    downloadPopup.innerHTML = `

    <div
        class="ytp-panel ytp-quality-menu"
        style="width: 150px; height: 225px; min-width:150px"
    >
        <div class="ytp-panel-menu" role="menu" style="height: 180px; padding:0">

            <div style="height:45px;" class="ytp-menuitem download-quality-btn" data-quality="1080p" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label" style="    padding-left: 42px;" data-quality="1080p">
                    <div data-quality="1080p">
                        <span data-quality="1080p"> 
                            1080p
                        </span>
                    </div>
                </div>
            </div>

            <div style="height:45px;" class="ytp-menuitem download-quality-btn" data-quality="720p" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label" style="    padding-left: 42px;" data-quality="720p">
                    <div data-quality="720p">
                        <span data-quality="720p">
                            720p
                        </span>
                    </div>
                </div>
            </div>

            <div style="height:45px;" class="ytp-menuitem download-quality-btn" data-quality="480p" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label" style="    padding-left: 42px;" data-quality="480p">
                    <div data-quality="480p">
                        <span data-quality="480p">
                            480p
                        </span>
                    </div>
                </div>
            </div>

            <div style="height:45px;" class="ytp-menuitem download-quality-btn" data-quality="360p" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label" style="    padding-left: 42px;" data-quality="360p">
                    <div data-quality="360p">
                        <span data-quality="360p">
                            360p
                        </span>
                    </div>
                </div>
            </div>

            <div style="height:45px;" class="ytp-menuitem download-quality-btn" data-quality="240p" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label" style="    padding-left: 42px;" data-quality="240p">
                    <div data-quality="240p">
                        <span data-quality="240p">
                            240p
                        </span>
                    </div>
                </div>
            </div>
            
            <div style="height:45px;" class="ytp-menuitem download-quality-btn" data-quality="144p" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label" style="    padding-left: 42px;" data-quality="144p">
                    <div data-quality="144p">
                        <span data-quality="144p">
                            144p
                        </span>
                    </div>
                </div>
            </div>

            <div style="height:45px;" class="ytp-menuitem download-quality-btn" data-quality="audioo" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label" style="    padding-left: 42px;" data-quality="audioo">
                    <div data-quality="audioo">
                        <span data-quality="audioo">
                            Audio
                        </span>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `;

    moviePlayer.appendChild(downloadPopup);

    const qualityBtns = document.getElementsByClassName("download-quality-btn");
    for (let i = 0; i < qualityBtns.length; i++) {
        const qualityBtn = qualityBtns[i];
        qualityBtn.addEventListener("click", function (e) {
            let url = location.href;
            url = new URL(url);
            url = url.searchParams.get("v");
            url = `https://www.youtube.com/watch?v=${url}`;
            const quality = e.target.dataset.quality;
            const sliceQuality = e.target.dataset.quality.slice(0, -1);
            const data = {
                quality: sliceQuality,
                url,
                title: (
                    document.title
                        .replace(
                            /[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
                            ""
                        )
                        .split(" ")
                        .filter((v) => v !== "")
                        .join("_") +
                    "_" +
                    (quality === "audioo" ? sliceQuality : quality)
                )
                    .toString()
                    .trim(),
            };
            Browser().runtime.sendMessage({ type: "download", data });
        });
    }
}

function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// check browser
function Browser() {
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
        return chrome;
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        return browser;
    } else {
        return chrome;
    }
}
