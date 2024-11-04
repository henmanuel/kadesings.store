# EC2 Ububtu 24.04 LTS x84_64 g5.2xlarge

#Verify You Have a CUDA-Capable GPU: NVIDIA Corporation GA102GL [A10G] (rev a1)
lspci | grep -i nvidia

#Verify You Have a Supported Version of Linux:
uname -m && cat /etc/*release

#Verify the System Has gcc Installed
gcc --version

#Prepare Ubuntu
sudo apt-key del 7fa2af80
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install cuda-toolkit
sudo apt-get install nvidia-gds

sudo reboot

#Post-installation Actions
export PATH=/usr/local/cuda-12.6/bin${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-12.6/lib64\
                         ${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}

#Installing with Apt
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sed -i -e '/experimental/ s/^#//g' /etc/apt/sources.list.d/nvidia-container-toolkit.list
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
sudo docker run --gpus all \
    --shm-size 1g \
    -e HF_TOKEN=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 \
    -p 8080:80 \
    -v $PWD/data:/data ghcr.io/huggingface/text-generation-inference:2.4.0 \
    --model-id meta-llama/Llama-2-7b-chat-hf
