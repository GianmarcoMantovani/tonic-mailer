# Node Mailer Tonic 3

### Steps to run the routine on the server

1. Logon as root to tonic3.com server
2. Run : su gitlab-runner
3. cd /home/tonicuser/node-mailer/
4. Run : nvm use 10.24.1
5. Check if pm2 is installed, if not run : npm install pm2 -g
6. Environment
   1. Production : pm2 start pm2-config-files/pm2_prod_mailer.json
   2. Staging : pm2 start pm2-config-files/pm2_staging_mailer.json
