# IRS-Himbeere

XXXX

http://mvartan.com/2014/11/25/controlling-your-tv-or-any-ir-device-with-raspberry-pi/

http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/

## Preparing the Raspberry Pi
startx

static IP

A static IP
http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/
Open the /etc/network/interfaces file again and add the following changes:

Change iface wlan0 inet dhcp into iface wlan0 inet static. This changes the wlan0 interface from DHCP to static.

Add the following lines before the wpa-conf line:

address 192.168.1.155 # Static IP you want 
netmask 255.255.255.0 
gateway 192.168.1.1   # IP of your router
The Raspberry Pi will still be able to connect to the internet.

'ssh pi@192.168.2.30'

install LIRC

http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/

![enter image description here](http://www.element14.com/community/servlet/JiveServlet/previewBody/68203-102-6-294412/GPIO.png)

 gpio_in_pin=23 gpio_out_ping=22"

exit to exit ssh

## Installation
For a local installation, follow these steps:
 1. Have [Node.js](https://nodejs.org/) and [git](https://git-scm.com/) installed
 2. Clone this repository: `git clone https://github.com/RRothfeld/IRS-Himbeere.git` 
 3. Change into the created folder: `cd IRS-Himbeere`
 4. Install node modules: `npm install`
 5. sudo chmod -R 666 IRS-Himbeere/

 5. There are two options to start the web server. The quick, yet temporary, option: `node app.js`. Or the permanent option, which will automatically start the webserver with the Raspberry Pi booting:

sudo nano /etc/rc.local 

# Start IRS server
printf "[ OWN ]  Starting IRS Himbeere\n"
/home/pi/IRS-Himbeere/node_modules/forever/bin/forever start /home/pi/IRS-Himbeere/app.js &

before exit 0

then save via CTRL+X, Y, ENTER


 6. Open [http://localhost:3000/](http://localhost:3000/) in your web browser

## Updating the Raspberry Pi after repository changes
to preserve favorites first or create copy of edit screen
ssh in then 'cd IRS-Himbeere/' then 'git pull' then restart 'sudo shutdown -r 0'

