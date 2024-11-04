# EC2 Ububtu 24.04 LTS x84_64 g5.2xlarge

#Verify You Have a CUDA-Capable GPU: NVIDIA Corporation GA102GL [A10G] (rev a1)
lspci | grep -i nvidia

#Verify You Have a Supported Version of Linux:
uname -m && cat /etc/*release

#Verify the System Has gcc Installed
sudo apt-get update
sudo apt install gcc -y
gcc --version

#Prepare Ubuntu
sudo apt-key del 7fa2af80
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install cuda-toolkit -y
sudo apt-get install -y nvidia-open
sudo apt-get install -y cuda-drivers
sudo apt-get install nvidia-gds -y

wget https://developer.download.nvidia.com/compute/cuda/12.6.2/docs/sidebar/md5sum.txt
md5sum md5sum.txt


sudo reboot