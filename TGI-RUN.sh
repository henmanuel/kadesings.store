#Post-installation Actions
export PATH=/usr/local/cuda-12.6/bin${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-12.6/lib64\
                         ${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}

#Installing with Apt
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

#Configuring Docker
sudo nvidia-ctk runtime configure --runtime=docker

#Install Docker
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo docker --version
sudo docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi

#RUN
sudo docker run --name tgi-container --gpus all \
    --shm-size 8g \
    -e HF_TOKEN=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 \
    -p 8080:80 -p 9090:9090 -p 3000:3000 \
    -v $PWD/data:/data ghcr.io/huggingface/text-generation-inference:latest \
    --model-id Qwen/Qwen2.5-7B-Instruct #meta-llama/Llama-3.2-3B-Instruct

wget https://github.com/prometheus/prometheus/releases/download/v2.52.0/prometheus-2.52.0.linux-amd64.tar.gz
tar -xvzf prometheus-2.52.0.linux-amd64.tar.gz
cd prometheus-2.52.0.linux-amd64

wget https://dl.grafana.com/oss/release/grafana-11.0.0.linux-amd64.tar.gz
tar -zxvf grafana-11.0.0.linux-amd64.tar.gz

sudo docker cp ../prometheus-2.52.0.linux-amd64 tgi-container:/usr/src/prometheus-2.52.0.linux-amd64
sudo docker exec -it tgi-container /bin/bash
apt update
cd prometheus-2.52.0.linux-amd64
echo -e "global:\n  scrape_interval: 15s\n\nscrape_configs:\n  - job_name: \"tgi\"\n    static_configs:\n      - targets: [\"0.0.0.0:80\"]" > prometheus.yml
./prometheus --config.file="prometheus.yml"

sudo docker exec -it tgi-container /bin/bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
	| tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
	&& echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
	| tee /etc/apt/sources.list.d/ngrok.list \
	&& apt update \
	&& apt install ngrok
ngrok config add-authtoken 2nzfotA3vUY7GRvZoZR6G8YUeN9_3xEZu9fovve6x2DYpgEdK
ngrok http http://0.0.0.0:9090

sudo docker exec -it tgi-container /bin/bash
cd prometheus-2.52.0.linux-amd64/grafana-v11.0.0
./bin/grafana-server





sudo apt install -y python3-full
sudo python3 -m venv venv
source venv/bin/activate
sudo chown -R ubuntu:ubuntu venv
pip install aiohttp
python3 TGI-RUN-AWS-TEST.py



sudo docker stop 805c2b7d434d
sudo docker rm 805c2b7d434d

#https://huggingface.co/docs/text-generation-inference/installation_nvidia
#https://huggingface.co/docs/text-generation-inference/basic_tutorials/monitoring
