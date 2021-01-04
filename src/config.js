const os = require('os');

module.exports = Object.freeze({
  numWorkers: Object.keys(os.cpus()).length,
  worker: {
    logLevel: 'debug',
    logTags: [
      'rtp',
      'rtcp',
      'ice',
      'dtls'
    ],
    rtcMinPort: 40000,
    rtcMaxPort: 49999
  },
  router: {
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
      }
    ]
  },
  webRtcTransport: {
    listenIps: [ { ip: '45.76.52.110', announcedIp: '45.76.52.110' } ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    preferTcp: false
  }
});
