# Mainnet
# Run using "bash script-mainnet.bash"

curl -v -X POST https://s1.ripple.com:51234/ \
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
