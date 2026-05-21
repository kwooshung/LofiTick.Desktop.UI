endpoints=(
  "GET /hotsearch/dates"
  "GET /hotsearch/rows"
  "POST /hotsearch/rows"
  "GET /hotsearch/dates/recount"
  "POST /hotsearch/dates/recount"
  "GET /hotsearch/rows/1"
  "PATCH /hotsearch/rows/1"
  "GET /health"
  "GET /security/sign/init"
)

for ep in "${endpoints[@]}"; do
  method=$(echo $ep | cut -d' ' -f1)
  path=$(echo $ep | cut -d' ' -f2)
  url="http://127.0.0.1:8180$path"
  
  echo "--- $method $path ---"
  curl -s -X "$method" -i "$url" | head -n 20
  echo -e "\n"
done
