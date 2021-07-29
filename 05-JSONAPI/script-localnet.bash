# Localnet
# Run using "bash script-localnet.bash"

curl -v -X POST http://localhost:5005/ \
-H 'Content-Type: application/json' \
-d '{
  "method": "account_info",
  "params": [
    {
      "account": "rLcxBUrZESqHnruY4fX7GQthRjDCDSAWia",
      "strict": true,
      "ledger_index": "validated",
      "api_version": 1
    }
  ]
}'
