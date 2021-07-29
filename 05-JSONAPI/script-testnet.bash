# Mainnet
# Run using "bash script-mainnet.bash"

curl -v -X POST https://s.altnet.rippletest.net:51234/ \
-H 'Content-Type: application/json' \
-d '{
  "method": "account_info",
  "params": [
    {
      "account": "rww9WLeWwviNvAJV3QeRCof3kJLomPnaNw",
      "strict": true,
      "ledger_index": "validated",
      "api_version": 1
    }
  ]
}'
