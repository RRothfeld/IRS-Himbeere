# IRS-Himbeere

XXXX

## Preparing the Raspberry Pi
sudo apt-get update
sudo apt-get install git 

install LIRC

'ssh pi@192.168.2.30'

sudo shutdown -r 0
 sudo nano /etc/lirc/hardware.conf

sudo echo "lirc_dev lirc_rpi gpio_in_pin=23 gpio_out_ping=22" | sudo tee -a /etc/modules

exit to exit ssh

## Installation
For a local installation, follow these steps:
 1. Have [Node.js](https://nodejs.org/) and [git](https://git-scm.com/) installed
 2. Clone this repository: `git clone https://github.com/RRothfeld/IRS-Himbeere.git` 
 3. Change into the created folder: `cd IRS-Himbeere`
 4. Install node modules: `npm install`
 5. There are two options to start the web server. The quick, yet temporary, option: `node app.js`. Or the permanent option, which will automatically start the webserver with the Raspberry Pi booting:

sudo nano /etc/rc.local 

# Start IRS server
printf "[ OWN ]  Starting IRS Himbeere\n"
/home/pi/IRS-Himbeere/node_modules/forever/bin/forever start /home/pi/IRS-Himbeere/app.js &

before exit 0

then save via CTRL+X, Y, ENTER

 6. Open [http://localhost:3000/](http://localhost:3000/) in your web browser
