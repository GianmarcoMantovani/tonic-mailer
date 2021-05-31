start-mailer-staging:
	pm2 start pm2-config-files/pm2_staging_mailer.json

start-mailer-prod:
	pm2 start pm2-config-files/pm2_prod_mailer.json
