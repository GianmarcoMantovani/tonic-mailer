start-mailer-staging:
	pm2 stop tonic_mailer_smtp || true
	pm2 delete tonic_mailer_smtp || true
	pm2 start pm2-config-files/pm2_staging_mailer.json

start-mailer-prod:
	pm2 stop tonic_mailer_smtp || true
	pm2 delete tonic_mailer_smtp || true
	pm2 start pm2-config-files/pm2_prod_mailer.json
