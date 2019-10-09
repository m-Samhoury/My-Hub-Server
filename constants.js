const IP = "192.168.1.8";
const PORT = 3000;

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define("URL", "http://" + IP + ":" + PORT + "/");
define("IP", IP);
