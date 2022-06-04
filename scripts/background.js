Browser().runtime.onInstalled.addListener(() => {
    saveData({ isConnected: false });
});

const hostUrl = "http://localhost:53422";

const socket = io(hostUrl);

socket.on("connect", () => {
    saveData({ isConnected: true });
    console.log("Client socket connected...");
});

socket.on("disconnect", () => {
    saveData({ isConnected: false });
    console.log("Client socket disconnected...");
});

socket.on("connect_error", () => {
    saveData({ isConnected: false });
    setTimeout(() => {
        socket.connect();
    }, 5000);
});

socket.on("complete", (socketData) => {
    getData(["current", "history"], (data) => {
        updateHistory(
            {
                type: "complete",
                id: socketData.start,
                title: socketData.title,
            },
            data.history,
            true
        );
        awaitingDownload(data.history);
    });
});

function awaitingDownload(history) {
    if (Array.isArray(history) && history.length > 0) {
        let completeArr = [];
        let waitingArr = [];
        for (let i = 0; i < history.length; i++) {
            const element = history[i];
            if (element.type !== "waiting") {
                completeArr.push(element);
            } else if (element.type === "waiting") {
                waitingArr.push(element);
            }
        }

        if (waitingArr.length > 0) {
            const data = waitingArr[waitingArr.length - 1];
            waitingArr.pop();
            waitingArr = waitingArr.sort((a, b) => b.date - a.date);
            let concatArr = completeArr.concat(waitingArr);
            socket.emit("download", data);

            saveData({
                current: {
                    type: "processing",
                    title: data.title,
                    quality: data.quality,
                    url: data.url,
                },
                history: concatArr,
            });
        }
    }
}

socket.on("downloading", (data) => {
    if (data) {
        saveData({
            current: {
                type: "downloading",
                ...data,
            },
        });
    }
});

socket.on("alreadyHave", () => {
    saveData({ current: "" });
});

Browser().runtime.onMessage.addListener((res) => {
    if (res.type === "download") {
        getData(["current", "history"], (result) => {
            console.log(result.current);
            if (result.current) {
                updateHistory(
                    { type: "waiting", ...res.data, date: Date.now() },
                    result.history
                );
            } else {
                socket.emit("download", res.data);
                saveData({
                    current: { type: "processing", ...res.data },
                });
            }
        });
    }
    if (res.type === "canceldownload") {
        getData(["current", "history"], (result) => {
            if (result.current) {
                const currentData = result.current;
                updateHistory(
                    {
                        type: "failed",
                        title: currentData.title,
                        url: currentData.url,
                        id: currentData.start,
                    },
                    result.history,
                    true
                );

                socket.emit("canceldownload", "test");

                awaitingDownload(result.history);
            }
        });
    }

    if (res.type === "opentab") {
        Browser().tabs.create({ url: res.url });
    }
});

function updateHistory(pushData, history, isCurrent) {
    const historyArr = Array.isArray(history) ? history : [];
    historyArr.push(pushData);
    let completeArr = [];
    let waitingArr = [];
    for (let i = 0; i < historyArr.length; i++) {
        const element = historyArr[i];
        if (element.type !== "waiting") {
            completeArr.push(element);
        } else if (element.type === "waiting") {
            waitingArr.push(element);
        }
    }
    waitingArr = waitingArr.sort((a, b) => b.date - a.date);
    let concatArr = completeArr.concat(waitingArr);
    if (isCurrent) {
        saveData({ history: concatArr, current: "" });
    } else {
        saveData({ history: concatArr });
    }
}

// send message to tab function
function sendMessageToTab(data) {
    Browser().tabs.query({ url: "https://www.youtube.com/*" }, (tabs) => {
        if (tabs.length > 0) {
            for (let i = 0; i < tabs.length; i++) {
                Browser().tabs.sendMessage(tabs[i].id, data);
            }
        }
    });
}

// get data Function
function getData(params, callback) {
    Browser().storage.local.get(params, (data) => {
        callback(data);
    });
}

// save data Function
function saveData(data) {
    Browser().storage.local.set(data);
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
