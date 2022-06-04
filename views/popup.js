function updatePopup() {
    const downloadContainer = document.getElementById("downloadContainer");
    Browser().storage.local.get(["history", "current"], (data) => {
        const history = data.history;
        if (Array.isArray(history) && history.length > 0) {
            for (let i = 0; i < history.length; i++) {
                const element = history[i];
                downloadContainer.insertAdjacentElement(
                    "afterend",
                    downloadHtml(element)
                );
            }
            initWaitingBtn();
        }
        const current = data.current;
        if (current) {
            downloadContainer.insertAdjacentElement(
                "afterbegin",
                downloadHtml(current)
            );
            initCurrentCancel();
        }
    });
}

Browser().storage.onChanged.addListener((changes, area) => {
    if (changes.current && changes.current.newValue) {
        const data = changes.current.newValue;
        const downloadContainer = document.getElementById("downloadContainer");
        if (downloadContainer.children.length > 0) {
            downloadContainer.children[0].classList.replace(
                "processing",
                "downloading"
            );
            downloadContainer.children[0].children[0].innerHTML = data.title;
            downloadContainer.children[0].children[1].children[0].innerHTML = `${data.percent} of ${data.total}`;
            downloadContainer.children[0].children[1].children[1].innerHTML = `Time left: ${data.time}s`;
            downloadContainer.children[0].children[2].children[0].style.width = `${data.percent}`;
            downloadContainer.children[0].children[3].children[1].innerHTML = `Speed: ${data.speed}`;
        }
    }
    if (changes.current && changes.current.newValue === "") {
        location.reload();
    }
    if (changes.history) {
        location.reload();
    }
    if (
        changes.current &&
        changes.current.newValue &&
        changes.current.newValue.type === "processing"
    ) {
        location.reload();
    }
    console.log(changes.history, changes.current);
});

// popup event
document.addEventListener("DOMContentLoaded", updatePopup);

const downloadHtml = (data) => {
    const downloadList = document.createElement("div");
    downloadList.classList.add("download", data.type);
    if (data.type === "complete") {
        downloadList.addEventListener("click", function (e) {
            const fileName =
                e.target.parentNode.parentNode.children[0].innerHTML;
            Browser().downloads.showDefaultFolder();
        });
    }

    if (data.type === "failed") {
        downloadList.addEventListener("click", function (e) {
            Browser().runtime.sendMessage({ type: "opentab", url: data.url });
        });
    }
    const documentHtml = `
                <p class="download-title">${data.title}</p>
                <div class="size-quality space-between">
                    <p class="size">${data.percent ? data.percent : "0%"} of ${
        data.total ? data.total : "0MB"
    }</p>
                    <p class="quality">Time left: ${
                        data.time ? data.time : 0
                    }s</p>
                </div>
                <div class="progress-bar">
                    <div style="width:${
                        data.percent ? data.percent : "0%"
                    }" class="progress"></div>
                </div>
                <div class="status-percent space-between">
                    <p> <button title="Cancel Download" class="${
                        data.type === "processing" ||
                        data.type === "downloading"
                            ? "cancel-downloading-btn"
                            : ""
                    }"><svg
                    width="10"
                    height="10"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1.64001 0.27L6.50001 5.13L11.34 0.29C11.4248 0.199717 11.527 0.127495 11.6404 0.0776621C11.7538 0.0278297 11.8761 0.00141434 12 0C12.2652 0 12.5196 0.105357 12.7071 0.292893C12.8947 0.48043 13 0.734784 13 1C13.0023 1.1226 12.9796 1.24439 12.9332 1.35788C12.8867 1.47138 12.8176 1.57419 12.73 1.66L7.84001 6.5L12.73 11.39C12.8948 11.5512 12.9915 11.7696 13 12C13 12.2652 12.8947 12.5196 12.7071 12.7071C12.5196 12.8946 12.2652 13 12 13C11.8726 13.0053 11.7454 12.984 11.6266 12.9375C11.5078 12.8911 11.4 12.8204 11.31 12.73L6.50001 7.87L1.65001 12.72C1.56552 12.8073 1.46457 12.8769 1.35301 12.925C1.24145 12.9731 1.12147 12.9986 1.00001 13C0.734794 13 0.48044 12.8946 0.292903 12.7071C0.105367 12.5196 1.0118e-05 12.2652 1.0118e-05 12C-0.00232138 11.8774 0.0204257 11.7556 0.0668552 11.6421C0.113285 11.5286 0.182417 11.4258 0.27001 11.34L5.16001 6.5L0.27001 1.61C0.105195 1.44876 0.00854974 1.23041 1.0118e-05 1C1.0118e-05 0.734784 0.105367 0.48043 0.292903 0.292893C0.48044 0.105357 0.734794 0 1.00001 0C1.24001 0.003 1.47001 0.1 1.64001 0.27Z"
                        fill="#CE1312"
                    />
                </svg></button> Downloading...</p>
                    <p>Speed: ${data.speed ? data.speed : "0KB/s"}</p>
                </div>

                <div class="processing-text space-between">
                    <p><button title="Cancel Download" class="${
                        data.type === "processing" ||
                        data.type === "downloading"
                            ? "cancel-downloading-btn"
                            : ""
                    }"><svg
                    width="10"
                    height="10"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1.64001 0.27L6.50001 5.13L11.34 0.29C11.4248 0.199717 11.527 0.127495 11.6404 0.0776621C11.7538 0.0278297 11.8761 0.00141434 12 0C12.2652 0 12.5196 0.105357 12.7071 0.292893C12.8947 0.48043 13 0.734784 13 1C13.0023 1.1226 12.9796 1.24439 12.9332 1.35788C12.8867 1.47138 12.8176 1.57419 12.73 1.66L7.84001 6.5L12.73 11.39C12.8948 11.5512 12.9915 11.7696 13 12C13 12.2652 12.8947 12.5196 12.7071 12.7071C12.5196 12.8946 12.2652 13 12 13C11.8726 13.0053 11.7454 12.984 11.6266 12.9375C11.5078 12.8911 11.4 12.8204 11.31 12.73L6.50001 7.87L1.65001 12.72C1.56552 12.8073 1.46457 12.8769 1.35301 12.925C1.24145 12.9731 1.12147 12.9986 1.00001 13C0.734794 13 0.48044 12.8946 0.292903 12.7071C0.105367 12.5196 1.0118e-05 12.2652 1.0118e-05 12C-0.00232138 11.8774 0.0204257 11.7556 0.0668552 11.6421C0.113285 11.5286 0.182417 11.4258 0.27001 11.34L5.16001 6.5L0.27001 1.61C0.105195 1.44876 0.00854974 1.23041 1.0118e-05 1C1.0118e-05 0.734784 0.105367 0.48043 0.292903 0.292893C0.48044 0.105357 0.734794 0 1.00001 0C1.24001 0.003 1.47001 0.1 1.64001 0.27Z"
                        fill="#CE1312"
                    />
                </svg></button> 
                    Processing...</p>
                    <p>Speed: 0KB/s</p>
                    
                </div>



                <div class="complete-text space-between">
                    <p>
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 11 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clip-path="url(#clip0_105_10)">
                                <path
                                    d="M9.73601 0.970056C9.80426 0.900422 9.88571 0.845103 9.9756 0.807339C10.0655 0.769574 10.162 0.750122 10.2595 0.750122C10.357 0.750122 10.4535 0.769574 10.5434 0.807339C10.6333 0.845103 10.7148 0.900422 10.783 0.970056C11.069 1.25906 11.073 1.72606 10.793 2.02006L4.88001 9.01006C4.81288 9.08378 4.73141 9.14303 4.64059 9.18418C4.54977 9.22533 4.45151 9.24752 4.35182 9.2494C4.25213 9.25127 4.1531 9.23278 4.0608 9.19507C3.9685 9.15735 3.88487 9.1012 3.81501 9.03006L0.217011 5.38406C0.0782478 5.24254 0.000518799 5.05225 0.000518799 4.85406C0.000518799 4.65586 0.0782478 4.46557 0.217011 4.32406C0.285257 4.25442 0.366709 4.1991 0.456599 4.16134C0.546489 4.12357 0.64301 4.10412 0.740511 4.10412C0.838011 4.10412 0.934532 4.12357 1.02442 4.16134C1.11431 4.1991 1.19576 4.25442 1.26401 4.32406L4.31601 7.41706L9.71601 0.992056C9.72223 0.984328 9.72891 0.976981 9.73601 0.970056Z"
                                    fill="#27AE60"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_105_10">
                                    <rect
                                        width="11.0003"
                                        height="10"
                                        fill="white"
                                    />
                                </clipPath>
                            </defs></svg
                        >Download Completed
                    </p>
                    
                </div>

                <div class="failed-text space-between">
                    <p>
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 13 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.64001 0.27L6.50001 5.13L11.34 0.29C11.4248 0.199717 11.527 0.127495 11.6404 0.0776621C11.7538 0.0278297 11.8761 0.00141434 12 0C12.2652 0 12.5196 0.105357 12.7071 0.292893C12.8947 0.48043 13 0.734784 13 1C13.0023 1.1226 12.9796 1.24439 12.9332 1.35788C12.8867 1.47138 12.8176 1.57419 12.73 1.66L7.84001 6.5L12.73 11.39C12.8948 11.5512 12.9915 11.7696 13 12C13 12.2652 12.8947 12.5196 12.7071 12.7071C12.5196 12.8946 12.2652 13 12 13C11.8726 13.0053 11.7454 12.984 11.6266 12.9375C11.5078 12.8911 11.4 12.8204 11.31 12.73L6.50001 7.87L1.65001 12.72C1.56552 12.8073 1.46457 12.8769 1.35301 12.925C1.24145 12.9731 1.12147 12.9986 1.00001 13C0.734794 13 0.48044 12.8946 0.292903 12.7071C0.105367 12.5196 1.0118e-05 12.2652 1.0118e-05 12C-0.00232138 11.8774 0.0204257 11.7556 0.0668552 11.6421C0.113285 11.5286 0.182417 11.4258 0.27001 11.34L5.16001 6.5L0.27001 1.61C0.105195 1.44876 0.00854974 1.23041 1.0118e-05 1C1.0118e-05 0.734784 0.105367 0.48043 0.292903 0.292893C0.48044 0.105357 0.734794 0 1.00001 0C1.24001 0.003 1.47001 0.1 1.64001 0.27Z"
                                fill="#CE1312"
                            />
                        </svg>
                        Download Failed
                    </p>
                    
                    </div>
                    <div class="waiting-text space-between">
                        <p>
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                                    stroke="#F2994A"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M14 15L11.586 12.586C11.2109 12.211 11.0001 11.7024 11 11.172V5"
                                    stroke="#F2994A"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg
                            >Awaiting...
                        </p>
                        <button class="${data.type}-btn">Cancel</button>
                    </div>
                </div>`;
    downloadList.innerHTML = documentHtml;
    return downloadList;
};

function initWaitingBtn() {
    const waitingBtns = document.getElementsByClassName("waiting-btn");
    if (waitingBtns.length > 0) {
        for (let i = 0; i < waitingBtns.length; i++) {
            const element = waitingBtns[i];
            element.addEventListener("click", function (e) {
                const title =
                    e.target.parentNode.parentNode.children[0].innerHTML;
                Browser().storage.local.get("history", (result) => {
                    if (
                        result.history &&
                        Array.isArray(result.history) &&
                        result.history.length > 0
                    ) {
                        const filterArr = result.history.filter(
                            (v) => v.title !== title
                        );
                        Browser().storage.local.set({ history: filterArr });
                    }
                });
            });
        }
    }
}

function initCurrentCancel() {
    const cancelBtn = document.getElementsByClassName("cancel-downloading-btn");
    console.log(cancelBtn);
    if (cancelBtn.length > 0) {
        for (let i = 0; i < cancelBtn.length; i++) {
            const element = cancelBtn[i];
            element.addEventListener("click", function (e) {
                Browser().runtime.sendMessage({ type: "canceldownload" });
                console.log("Btn Check");
            });
        }
    }
}

// Check Browser
function Browser() {
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
        return chrome;
    }
    if (navigator.userAgent.indexOf("Firefox") !== -1) {
        return browser;
    }
}
