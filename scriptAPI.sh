#!/bin/bash
echo "Configurant Producció (Ubuntu VM)"
echo "---------------------------------"

# 1. PREGUNTAR DADES
read -p "Host de No-IP (ex: toni-api.ddns.net): " NOIP_HOST
read -p "Usuari de DockerHub (ex: tonicrespi1): " DOCKER_USER
read -p "Tag de la imatge (ex: v1.0.0): " IMAGE_TAG

# 2. Instal·lació de Docker
echo "Instal·lant Docker..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Preparar fitxers
mkdir -p ~/api-production
cd ~/api-production

# Creem el Caddyfile
cat <<EOF > Caddyfile
$NOIP_HOST {
    tls internal
    reverse_proxy api-service:3000
}
EOF

# Creem el docker-compose.yml
cat <<EOF > docker-compose.yml
services:
  api-service:
    image: $DOCKER_USER/ifc31c-iaw-crespi-toni:$IMAGE_TAG
    container_name: api_rest
    restart: always
    networks:
      - prod_network

  caddy:
    image: caddy:latest
    container_name: proxy_caddy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - prod_network

networks:
  prod_network:
    driver: bridge

volumes:
  caddy_data:
  caddy_config:
EOF

# 4. Arrencar
echo "Llançant serveis..."
sudo docker compose down || true
sudo docker compose pull
sudo docker compose up -d

echo "---------------------------------------------------"
echo "✅ FET! Ves a: https://$NOIP_HOST/api/alumnes"
echo "---------------------------------------------------"