# IRS-Himbeere
This Node.js web server host an application with which infra-red remotes (e.g. for TV) can be replaced and controlled via a internet-enabled device within the same network/over the internet. This application is tailored towards certain remotes, yet would function with most IR remotes with some adjustments. The final product can look like this:
![Application screenshot](/archive/screenshot.png)

This application was motivated, influenced, and is based on the following articles:
 - [Controlling your TV or any infrared device with a Raspberry Pi (Michael Vartan)](http://mvartan.com/2014/11/25/controlling-your-tv-or-any-ir-device-with-raspberry-pi/)
 - [Setting Up LIRC on the RaspberryPi (Alex Bain)](http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/)
 - [Automatically connect a Raspberry Pi to a Wifi network (Pieter Beulque)](http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/)

## Preparing the Raspberry Pi
The hardware requirements can be taken from [Michael Vartan's article](http://mvartan.com/2014/11/25/controlling-your-tv-or-any-ir-device-with-raspberry-pi/) and supplemented with a WiFi dongle (e.g. Edimax EW-7811UN).
Then, [download and install Raspbian](https://www.raspberrypi.org/documentation/installation/installing-images/) on your Raspberry Pi and connect it to your local wifi, using the operating system's GUI (which can then be disabled with the options menu opened with the command: `sudo raspi-config`).

Next, the Raspberry Pi should have a static IP address as to simplify reaching the host (read [Pieter Beulque's article](http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/) for the full information):

 - Open /etc/network/interfaces: `sudo nano /etc/network/interfaces`
 - Change `iface wlan0 inet dhcp` into `iface wlan0 inet static`
 - Add the following lines before the wpa-conf line (replacing the IPs):
```
address 192.168.2.30 # Static IP you want
netmask 255.255.255.0
gateway 192.168.2.1   # IP of your router
```
 - Restart the Raspberry Pi: `sudo shutdown -r 0`

After the Raspberry Pi has restarted, you can now reach it via SSH from any machine within the local network via: `ssh pi@192.168.2.30` (replacing the IP with the static IP you chose for your Raspberry Pi). The remaining tasks can now be performed without having the Raspberry Pi connected to a monitor/keyboard/etc., from a different SSH-enabled computer.

The WiFi dongle goes into a sleep mode if inactive for longer periods of time. To keep the Raspberry Pi responsive and prevent the WiFi sleep, execute `sudo nano /etc/modprobe.d/8192cu.conf` and add this line: `options 8192cu rtw_power_mgnt=0 rtw_enusbss=0`.

Now, install LIRC as described in [Alex Bain's article](http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/) and set up lircd.conf for your TV/remote constellation. My own can be found in the /archive folder within this repository.

## Application Installation
With the Raspberry Pi and LIRC all set up, it is time to install the application itself:
 1. Have [Node.js](https://nodejs.org/) and [git](https://git-scm.com/) installed
 2. Clone this repository: `git clone https://github.com/RRothfeld/IRS-Himbeere.git` 
 3. Change into the created folder: `cd IRS-Himbeere`
 4. Install node modules: `npm install`
 5. The application is now ready to run, yet there are two options to start the web server: 
	 A. The quick, yet temporary, option: `node app.js`
	 B. The permanent option, which will automatically start the webserver with the Raspberry Pi booting. Execute `sudo nano /etc/rc.local`, add `/home/pi/IRS-Himbeere/node_modules/forever/bin/forever start /home/pi/IRS-Himbeere/app.js &` before `before exit 0`, and save (CTRL+X, then Y, then ENTER). Conclude by restarting the Raspberry Pi: `sudo shutdown -r 0`.
 6. Open [http://localhost:3000/](http://localhost:3000/) in your web browser

## Updating the Raspberry Pi after repository updates
**Important:** Be sure to make a copy of your favroites list, to prevent loss of all your saved channels!

 1. Connect to the Raspberry Pi: `ssh pi@192.168.2.30` (replacing the IP with the static IP you chose for your Raspberry Pi)
 2. Change into the application's directory: `cd IRS-Himbeere/`
 3. Retrieve updates from this git repository:
	 A. Execute `git pull`
	 B. If the above does not work as changes have been made, you can force your local application to be overwritten with the repository's state (make sure to save your favorites!) via: `git fetch --all && git reset --hard origin/master`
 4.  If files outside the IRS-Himbeere/html folder have been updated, restart the Raspberry Pi: `sudo shutdown -r 0`
