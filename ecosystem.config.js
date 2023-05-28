module.exports = {
  apps : [{
    name   : "be-sikopi",
    script : "node ./build/server.js",
    exec_mode: "cluster"
  }]
}
