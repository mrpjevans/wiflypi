# WiFlyPi

## Purpose

Have you ever turned up at a show/conference/meet-up with an embedded or otherwise headless Raspberry Pi (I.e. no way/hard to add a keyboard and monitor) and needed to get on the WiFi? WiFlyPi is at least a partial solution.

WiFlyPi allows you to connect a ‘disconnected’ Raspberry Pi to the local WiFi network by turning into a WiFi hotspot.

## How it works

If your Raspberry Pi finds a known WiFi network, everything works as normal. However, if no such WiFi can be found, within 2 minutes a hotspot access point will be activated. You can then connect to this hotspot with any WiFi capable gizmo.

Once connected to the bespoke hotspot, go to [http://10.42.0.1:3000]() in a web browser and you’ll be guided through configuring WiFi. The hotspot will then shutdown and your Raspberry Pi will connect to the chosen network.

## Limitations

WiFlyPi will not work with any WiFi network that requires you to open a web browser to log in.

## Requirements

This has been written for Raspberry Pi OS _BOOKWORM_ only. It uses the new Network Manager system for configuration. It will _not_ work with any other distribution.

Your user will need sudo access.

Tested on Raspberry Pi 5 with Raspberry Pi OS Bookworm Lite & Desktop.

## Installation

To make things a bit easier, there is a very basic bash script to automate the process.

Start by building your Raspberry Pi as normal and get some form of network connectivity sorted.

From a terminal window/ssh run the following:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/mrpjevans/wiflypi/main/install.sh)"
```

If you want to check the contents before running (i.e. you are a wise person) have a look at the raw file: [https://raw.githubusercontent.com/mrpjevans/wiflypi/main/install.sh]().

This will

- Install system-wide dependencies
- Get this repo
- Install the project dependencies
- Build the code
- Set up the web server as a system service
- Create a cron job to monitor network connections

The service will be installed in your home directory. One day I will figure out how to install it at system level, but today was not that day.

## Usage

Every 2 minutes WiFlyPi checks the network connections. It (currently) has no interest in wired Ethernet connections.

If the hotspot access point has not been configured, the script will create it automatically.

If there is no active WiFi connection, the hotspot will be enabled and the web service started.

You can now connect to the hotspot - default SSID is ‘hotspot’ and password ‘password’.

Access the web site at [http://10.42.0.1:3000/]()

On the site you can scan for local WiFi access points or specify a hidden one. Provide the password and the system will reconfigure WiFi to connect to the access point. You will be disconnected from the hotspot.

The profile will remain so in future the new WiFi network will connect automatically.

## Configuration

All defaults are set for Raspberry Pi OS Bookworm. These can be found in `src/config.ts`.

To override defaults, create a files called `env.json` in the root of the project. This will be picked up automatically and any settings will take precedence over the defaults.

You probably do not want to change much, but you absolutely should change the password like so:

```json
{
  “password”: “something much better than password”
}
```

You can also change the name of the service, the default port and the name of the hotspot. See `src/config.ts` for values.

## Changing hotspot name and password

To make these changes, first configure `env.json` as described above and then delete the existing connection by issuing this command:

```
nmcli con del id hotspot
```

Within 2 minutes a new hotspot will be configured with the new credentials.

## Disclaimer

This utility is intended for casual use only. It is not to be considered secure. Although the WiFi hotspot uses WPA encryption, HTTP traffic is unencrypted.

## Improvements

PRs welcomed!

## This doesn’t do x/y/z

Sorry about that. For a more complete and featured solution I recommend Raspberry Pi Connect: [https://www.raspberryconnect.com/projects/65-raspberrypi-hotspot-accesspoints/203-automated-switching-accesspoint-wifi-network]().
