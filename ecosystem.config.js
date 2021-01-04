module.exports = {
  apps : [{
    name: 'webrtc',
    script: 'src/server.js',
    watch: 'src'
  }, {
    name: 'web',
    script: 'npm',
    args : "run public-dev",
    watch: ['./public']
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
