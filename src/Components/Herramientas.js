export const formatTime = (time, simple) => {

    time = Math.round(time);

    let div1 = 0;
    let div2 = 0;

    if (simple) {
        div1 = 100;
        div2 = 1;
    }
    else {
        div1 = 10;
        div2 = 2;
    }

    const hours = Math.floor((time / 3600000) % 24)
    const minutes = Math.floor((time / 600000) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = Math.floor(((time % 1000) / div1)).toString().padStart(div2, "0");

    let timeF = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds}m`;

    if (hours > 0) {
        timeF = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds}m`;
    }
    else {
        if (minutes > 0) {
            timeF = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds}m`
        }
        else {
            if (seconds > 9) {
                timeF = `${seconds.toString().padStart(2, "0")}.${milliseconds}s`
            }
            else {
                timeF = `${seconds.toString().padStart(1, "0")}.${milliseconds}s`
            }
        }
    }

    return timeF;

};

export const formattedDateTime = (date) => {


    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

};